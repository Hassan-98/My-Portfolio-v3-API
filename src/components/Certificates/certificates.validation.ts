//= Modules
import { z } from 'zod';
//= Utils
import checkObjectId from '../../utils/checkObjectId';

export const CertificateSchema = z.object({
  title: z.string(),
  issuanceDate: z.coerce.date(),
  issuanceSource: z.string(),
  sourceLink: z.string().url().optional(),
  description: z.string().min(15),
  image: z.string().url().optional(),
  showInWebsite: z.boolean().optional(),
  showInCv: z.boolean(),
  order: z.number().gt(0),
});

export const IDSchema = z.object({
  id: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" })
});

export const OrderSchema = z.array(z.object({
  id: z.string().refine((val) => checkObjectId(val), { message: "must be a valid id" }),
  order: z.number().gt(0)
}))