"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.IDSchema = exports.WorkSchema = void 0;
//= Modules
const zod_1 = require("zod");
//= Utils
const checkObjectId_1 = __importDefault(require("../../utils/checkObjectId"));
//= Types
const types_1 = require("../../types");
const work_types_1 = require("./work.types");
const AnnotationSchema = zod_1.z.object({
    x: zod_1.z.number().min(0).max(100),
    y: zod_1.z.number().min(0).max(100),
    note: zod_1.z.string(),
});
const ScreenSchema = zod_1.z.object({
    image: zod_1.z.string().url(),
    caption: zod_1.z.string().optional(),
    roles: zod_1.z.array(zod_1.z.string()).optional(),
    annotations: zod_1.z.array(AnnotationSchema).optional(),
});
const MetricSchema = zod_1.z.object({
    label: zod_1.z.string(),
    value: zod_1.z.string(),
    icon: zod_1.z.string().optional(),
});
exports.WorkSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().min(15),
    stackType: zod_1.z.nativeEnum(types_1.StackType),
    importance: zod_1.z.nativeEnum(work_types_1.Importance),
    showInCv: zod_1.z.boolean(),
    showInWebsite: zod_1.z.boolean(),
    isTcgWork: zod_1.z.boolean(),
    kind: zod_1.z.nativeEnum(work_types_1.WorkKind).optional(),
    slug: zod_1.z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "must be a kebab-case slug" }).optional().or(zod_1.z.literal('')),
    tagline: zod_1.z.string().optional(),
    timeline: zod_1.z.object({
        start: zod_1.z.string().optional(),
        end: zod_1.z.string().optional(),
    }).optional(),
    metrics: zod_1.z.array(MetricSchema).optional(),
    roles: zod_1.z.array(zod_1.z.string()).optional(),
    modules: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        icon: zod_1.z.string().optional(),
        blurb: zod_1.z.string().optional(),
        roles: zod_1.z.array(zod_1.z.string()).optional(),
        screens: zod_1.z.array(ScreenSchema),
    })).optional(),
    flows: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string().optional(),
        steps: zod_1.z.array(zod_1.z.object({
            image: zod_1.z.string().url().optional(),
            caption: zod_1.z.string(),
            app: zod_1.z.string().optional(),
        })),
    })).optional(),
    outcomes: zod_1.z.array(MetricSchema).optional(),
    apps: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        audience: zod_1.z.string().optional(),
        platform: zod_1.z.string().optional(),
        icon: zod_1.z.string().optional(),
        color: zod_1.z.string().optional(),
        blurb: zod_1.z.string().optional(),
        screens: zod_1.z.array(ScreenSchema).optional(),
        links: zod_1.z.object({
            demo: zod_1.z.string().url().optional(),
            github: zod_1.z.string().url().optional(),
        }).optional(),
    })).optional(),
    architecture: zod_1.z.object({
        nodes: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            label: zod_1.z.string(),
            icon: zod_1.z.string().optional(),
            kind: zod_1.z.string().optional(),
        })),
        edges: zod_1.z.array(zod_1.z.object({
            from: zod_1.z.string(),
            to: zod_1.z.string(),
            label: zod_1.z.string().optional(),
        })),
    }).optional(),
    templateMeta: zod_1.z.object({
        sales: zod_1.z.number().min(0).optional(),
        rating: zod_1.z.number().min(0).max(5).optional(),
        category: zod_1.z.string().optional(),
        envatoUrl: zod_1.z.string().url().optional(),
        previewUrl: zod_1.z.string().url().optional(),
    }).optional(),
    links: zod_1.z.object({
        github: zod_1.z.string().url().optional(),
        demo: zod_1.z.string().url().optional(),
        apiRepo: zod_1.z.string().url().optional(),
        apiDocs: zod_1.z.string().url().optional(),
    }),
    images: zod_1.z.object({
        desktop: zod_1.z.string().url(),
        mobile: zod_1.z.string().url(),
    }).optional(),
    stack: zod_1.z.array(zod_1.z.object({
        stack: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" }),
        order: zod_1.z.number().gt(0),
    })),
    order: zod_1.z.number().gt(0),
});
exports.IDSchema = zod_1.z.object({
    id: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" })
});
exports.OrderSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string().refine((val) => (0, checkObjectId_1.default)(val), { message: "must be a valid id" }),
    order: zod_1.z.number().gt(0)
}));
//# sourceMappingURL=work.validation.js.map