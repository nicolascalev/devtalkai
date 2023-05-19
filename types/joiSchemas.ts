import Joi from "joi";

export const organizationSchema = Joi.object({
  name: Joi.string().required(),
  about: Joi.string().allow(null).allow(""),
  trainingResourcesUrl: Joi.string().uri().allow(null).allow(""),
  domainIndustry: Joi.string(),
  domainLiteracy: Joi.string(),
  roles: Joi.array(),
});

export const inviteSchema = Joi.object({
  email: Joi.string().email({ tlds: false }),
  organizationId: Joi.number().integer(),
});

export const profileSchema = Joi.object({
  fullName: Joi.string(),
  technicalProficiency: Joi.string().allow("").allow(null),
  role: Joi.string().allow("").allow(null),
});

export const projectSchema = Joi.object({
  label: Joi.string(),
  description: Joi.string(),
  objectives: Joi.array(),
  technicalStack: Joi.array(),
  timeConstraints: Joi.string().allow("").allow(null),
  integrations: Joi.array(),
  securityConsiderations: Joi.array(),
  documentationLink: Joi.string().uri().allow(null).allow(""),
});
