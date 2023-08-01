export type ServiceDateTime = {
  executingUserId: number,
  clinicId?: 0,
  startDate?: string,
  endDate?: string,
  startTime?: string,
  endTime?: string,
  patientAge?: number,
  patientId?: number,
  dC_LanguageId?: number,
  isMonday?: boolean,
  isTuesday?: boolean,
  isWednesday?: boolean,
  isThursday?: boolean,
  isFriday?: boolean,
  isSaturday?: boolean,
  isSunday?: boolean,
  serviceDetails?: [
    {
      serviceId?: number,
      servicePackageId?: number,
      specialtyId?: number,
      maxPosition?: number,
      medicalEmployeeId?: number,
      waitingTime?: number,
      duration?: number,
      partnerId?: number
    }
  ],
  dC_BookingAreaId?: number,
  variationCount?: number
  };