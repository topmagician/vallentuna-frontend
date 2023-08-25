export const homePath = () => {
  return "/";
};

export const loginPath = () => {
  return "/login";
};

export const registerPath = () => {
  return "/register";
};

export const forgotPasswordPath = () => {
  return "/forgot-password";
};

export const systematicFollowUpPath = () => {
  return "/follow-up";
};

export const adultSystematicFollowUpPath = () => {
  return "/follow-up-adult";
};

export const followUpSurveyPath = (codeNumber?: string) => {
  return `/follow-up-survey/${codeNumber || ":codeNumber"}`;
};

export const backgroundSurveyPath = (codeNumber?: string) => {
  return `/background-survey/${codeNumber || ":codeNumber"}`;
};

export const backgroundAdultSurveyPath = (codeNumber?: string) => {
  return `/background-adult-survey/${codeNumber || ":codeNumber"}`;
};

export const estimatesPath = () => {
  return "/estimates";
};

export const estimatesAdultPath = () => {
  return "/estimates-adult";
};

export const settingsPath = () => {
  return "/settings";
};

export const adminPath = () => {
  return "/admin";
};

export const adultCaseList = () => {
  return "/adult-case-list";
};


