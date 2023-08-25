export type BasicDataUnit = {
  id: number;
  description: string;
};

export type BackgroundSurveyBasicData = {
  genderEntities: BasicDataUnit[];
  educationVh1Entities: BasicDataUnit[];
  educationVh2Entities: BasicDataUnit[];
  employmentVh1Entities: BasicDataUnit[];
  employmentVh2Entities: BasicDataUnit[];
  establishedDiagnosesEntities: BasicDataUnit[];
  familyConstellationEntities: BasicDataUnit[];
  interpreterRequiredEntities: BasicDataUnit[];
  otherInterventionsEntities: BasicDataUnit[];
  previousInterventionEntities: BasicDataUnit[];
  problemAreaEntities: BasicDataUnit[];
  reasonForUpdateEntities: BasicDataUnit[];
  schoolUniformEntities: BasicDataUnit[];
  typeOfEffortEntities: BasicDataUnit[];
  whoParticipatesEntities: BasicDataUnit[];
};

export type FormDataByEntityName = {
  [entityName: string]: Array<number | string>;
};

export type FormDataMap = {
  [entityName: string]: {
    [idString: string]: boolean | string;
  };
};

export type BackgroundMetadata = {
  codeNumber: string;
  date: string;
  yearOfBirth: number;
}

export type BackgroundData = {
  codeNumber: string;
  date: string;
  yearOfBirth: number;
  country: string | null;
  formDataByEntityName: FormDataByEntityName;
};

export type BackgroundSurveyFormMetadata = {
  label: string;
  entityName: string;
  entitiesData: BasicDataUnit[];
}[]