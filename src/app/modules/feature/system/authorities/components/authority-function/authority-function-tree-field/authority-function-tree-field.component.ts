import { Component, inject, Input } from '@angular/core';
import { BaseControlValueAccessor } from "../../../../../../app-common/utility/base-control-value-acessor/base-control-value-acessor.directive";
import { AuthorityXFunction } from "../../../models/authority-x-function.model";
import { UntilDestroy } from "@ngneat/until-destroy";
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, shareReplay, tap } from "rxjs";
import { AuthenticationWebServiceService } from "../../../../../../../../api/services";
import { Function } from "../../../../functions/models/function.model";
import { FormControl } from '@angular/forms';


type Full_Model = AuthorityXFunction;
type Extra_Model = Function;

type TreeNode<T, TT = T, ID = any, AGGR = any> = {
    /**
     * The model oirignak index in the value array
     */
    index: number;
    expanded: boolean;
    model: T;
    aggregation?: AGGR,
    extraModel?: TT,
    children: TreeNode<T, TT, ID, AGGR>[];
    id: ID;
    parentId?: ID;
    parent?: TreeNode<T, TT, ID, AGGR>;
}

type NodeType = TreeNode<Full_Model, Extra_Model, any, {
    canAll: boolean;
}>;

@UntilDestroy()
@Component({
    selector: 'app-authority-function-tree-field',
    templateUrl: './authority-function-tree-field.component.html',
    styleUrls: ['./authority-function-tree-field.component.scss'],
})
export class AuthorityFunctionTreeFieldComponent extends BaseControlValueAccessor<Full_Model[]> {

    private authenticationWebServiceService = inject(AuthenticationWebServiceService);

    @Input() defaultAllRowsExpanded: boolean = true;

    forceSyncModelWithControl = false;

    public searchInput: FormControl = new FormControl('');
    searchQuery$ = new BehaviorSubject<string>('');


    constructor() {
        super();
        // Default value
        if (this.value == null) this.value = [];

        this.searchInput.valueChanges.pipe(
            distinctUntilChanged(), // Emit only when the current value is different from the last
        ).subscribe((_searchInput: string) => {
            this.searchQuery$.next(_searchInput);
        });
    }

    private expandedIndexes$ = new BehaviorSubject<number[]>([]);

    private functionList$ = this.authenticationWebServiceService.functionGetFunctionByConditionPost({}).pipe(
        map(res => res?.businessObjectList ?? []),
        tap((functionList) => {
            if (this.defaultAllRowsExpanded) {
                const arrayIndex = functionList?.map((_, i) => i).filter(i =>
                    functionList?.some(row => row.parentFunctionId === functionList[i].functionId)
                );
                this.expandedIndexes$.next(arrayIndex);
            }
        }),
        shareReplay(1),
    );

    public treeData$: Observable<NodeType[]> = combineLatest([
        this.functionList$,
        this.getValue$(),
        this.expandedIndexes$,
        this.searchQuery$,
    ]).pipe(
        distinctUntilChanged(),
        map(([functionList, value, expandedIndexes, searchQuery]) => {
            const nodes = (functionList ?? []).map((functionRow, i) => {
                return <NodeType>{
                    index: i,
                    expanded: expandedIndexes.includes(i),
                    model: {
                        canCreate: false,
                        canRead: false,
                        canUpdate: false,
                        canDelete: false,
                        ...value?.find(v => v?.functionId === functionRow.functionId),
                        functionId: functionRow.functionId,
                        function: undefined,
                        rightId: undefined,
                        right: undefined,
                        rightXFunctionId: undefined,
                    },
                    extraModel: functionRow,
                    id: functionRow?.functionId,
                    parentId: functionRow?.parentFunctionId,
                    children: [],
                }
            });

            if (searchQuery && searchQuery.length > 0) {
                const filterNodes = nodes.filter(x => x.extraModel?.functionName?.toLocaleUpperCase().includes(searchQuery.toLocaleUpperCase()));

                // Add parent nodes to the filtered results
                const nodesWithParents: NodeType[] = [];
                const visitedParentIds = new Set<number>();
                const nodeIds = new Set<number>();

                for (const node of filterNodes) {
                  if (node && !nodeIds.has(node.extraModel?.functionId!)) {
                    nodesWithParents.push(node);
                    nodeIds.add(node.extraModel?.functionId!);
                  }
                  if (node.extraModel?.parentFunctionId) {
                    let parentNode = this.findParent(node.extraModel.parentFunctionId, nodes, visitedParentIds);
                    while (parentNode) {
                        if (!nodeIds.has(parentNode.extraModel?.functionId!)) {
                            nodesWithParents.push(parentNode);
                            nodeIds.add(parentNode.extraModel?.functionId!);
                        }
                        parentNode = parentNode.extraModel?.parentFunctionId! ? this.findParent(parentNode.extraModel.parentFunctionId, nodes, visitedParentIds) : null;
                        }
                  }
                }

                return nodesWithParents;
              }


            return nodes;
        }),
        tap((nodes) => {
            this.skipNextGetValue$Emit = true;
            this.changeValue(nodes.map(node => node.model));
        }),
        map((nodes) => this.buildTreeFromFlatNodes(nodes)),
        map((nodes) => this.computeNodeDerivedValues(nodes)),
        map((nodes) => this.computeNodeAggregatedValues(nodes)),
        shareReplay(1),
    )

    public treeHeaderData$ = this.treeData$.pipe(
        map((rootNodes) => {
            return {
                canCreate: rootNodes.some(rootNode => rootNode.model.canCreate),
                canRead: rootNodes.some(rootNode => rootNode.model.canRead),
                canUpdate: rootNodes.some(rootNode => rootNode.model.canUpdate),
                canDelete: rootNodes.some(rootNode => rootNode.model.canDelete),
            }
        }),
    );

    private buildTreeFromFlatNodes<T, TT = T, ID = any>(nodes: TreeNode<T, TT, ID>[]) {
        const idToNodeMap: Map<ID, TreeNode<T, TT, ID>> = new Map();
        for (const node of nodes) {
            idToNodeMap.set(node.id, node);
        }

        const roots: TreeNode<T, TT, ID>[] = [];
        for (const node of nodes) {
            const parentId = node.parentId;
            if (parentId != null && idToNodeMap.has(parentId)) {
                const parent = idToNodeMap.get(parentId)!;
                parent.children.push(node);
                node.parent = parent;
            } else {
                roots.push(node);
            }
        }

        return roots;
    }

    private computeNodeDerivedValues(nodes: NodeType[]): NodeType[] {
        return nodes.map(node => {
            // Update children first
            node.children = this.computeNodeDerivedValues(node.children);

            node.model.canCreate = !!node.model.canCreate || node.children.some(childNode => childNode.model.canCreate);
            node.model.canRead = !!node.model.canRead || node.children.some(childNode => childNode.model.canRead);
            node.model.canUpdate = !!node.model.canUpdate || node.children.some(childNode => childNode.model.canUpdate);
            node.model.canDelete = !!node.model.canDelete || node.children.some(childNode => childNode.model.canDelete);

            return node;
        });
    }

    private computeNodeAggregatedValues(nodes: NodeType[]): NodeType[] {
        return nodes.map(node => {
            // Update children first
            node.children = this.computeNodeAggregatedValues(node.children);

            node.aggregation = {
                canAll: !!node.model.canCreate
                    || !!node.model.canRead
                    || !!node.model.canUpdate
                    || !!node.model.canDelete
                    || node.children.some(childNode => childNode.aggregation?.canAll),
            };

            return node;
        });
    }

    private getAllModifiedIndexes(nodes: TreeNode<Full_Model, Extra_Model> | TreeNode<Full_Model, Extra_Model>[]): number[] {
        if (!Array.isArray(nodes)) nodes = [nodes];

        return nodes
            .map(node => [node.index, ...this.getAllModifiedIndexes(node.children)])
            .reduce((pv, cv) => [...pv, ...cv], []);
    }

    public checkAllNodeValueRecursively(node: TreeNode<Full_Model, Extra_Model>, checked: boolean) {
        const modifiedIndexes = this.getAllModifiedIndexes(node);

        this.changeValue([
            ...this.value.map((row, i) => {
                if (!modifiedIndexes.includes(i)) return row;

                return {
                    ...row,
                    canCreate: checked,
                    canRead: checked,
                    canUpdate: checked,
                    canDelete: checked,
                }
            }),
        ])
    }

    public setNodeValueRecursively<K extends keyof Full_Model>(node: TreeNode<Full_Model, Extra_Model>, field: K, value: Full_Model[K]) {
        this.setNodesValueRecursively([node], field, value);
    }
    public setNodesValueRecursively<K extends keyof Full_Model>(nodes: TreeNode<Full_Model, Extra_Model>[], field: K, value: Full_Model[K]) {
        const modifiedIndexes = this.getAllModifiedIndexes(nodes);

        const fieldsToModify: K[] = (field === "canRead" && value === false)
            ? ["canRead", "canCreate", "canUpdate", "canDelete"] as K[]
            : [field] as K[];

        this.changeValue([
            ...this.value.map((row, i) => {
                if (!modifiedIndexes.includes(i)) return row;

                const modifiedRow = { ...row };
                for (const field of fieldsToModify) {
                    modifiedRow[field] = value;
                }

                return modifiedRow;
            }),
        ])
    }

    public toggleNode(node: TreeNode<Full_Model, Extra_Model>) {
        const expandedIndexes = this.expandedIndexes$.value;

        if (!expandedIndexes.includes(node.index)) {
            this.expandedIndexes$.next([
                ...expandedIndexes,
                node.index,
            ]);
        } else {
            this.expandedIndexes$.next(
                expandedIndexes.filter((index) => index !== node.index),
            );
        }
    }

    private findParent(parentId: number, nodes: NodeType[], visitedParentIds: Set<number>): NodeType | null {
        for (const node of nodes) {
          if (node.extraModel?.functionId === parentId && !visitedParentIds.has(parentId)) {
            visitedParentIds.add(parentId);
            return node;
          } else if (node.children?.length > 0) {
            const parent = this.findParent(parentId, node.children, visitedParentIds);
            if (parent) {
              return parent;
            }
          }
        }
        return null;
      }

}
