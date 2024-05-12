"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsValidator = exports.bodyValidator = void 0;
function bodyValidator(Schema, toBeParsedFields) {
    return (req, res, next) => {
        let body = req.body;
        if (toBeParsedFields && toBeParsedFields.length) {
            toBeParsedFields.forEach(field => {
                if (req.body[field])
                    body[field] = JSON.parse(req.body[field]);
            });
        }
        let validation_check = Schema.safeParse(body);
        if (!validation_check.success) {
            let InvalidFields = validation_check.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(' | ');
            res.status(422).json({
                success: false,
                data: null,
                errors: validation_check.error.issues,
                message: `Invalid request body, invalid fields (${InvalidFields})`
            });
        }
        else
            next();
    };
}
exports.bodyValidator = bodyValidator;
function paramsValidator(Schema) {
    return (req, res, next) => {
        let validation_check = Schema.safeParse(req.params);
        if (!validation_check.success) {
            let InvalidFields = validation_check.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(' | ');
            res.status(422).json({
                success: false,
                data: null,
                errors: validation_check.error.issues,
                message: `Invalid request params, invalid fields (${InvalidFields})`
            });
        }
        else
            next();
    };
}
exports.paramsValidator = paramsValidator;
//# sourceMappingURL=validation.middleware.js.map