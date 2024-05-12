"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Types.ObjectId;
exports.default = (id) => {
    if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
};
//# sourceMappingURL=checkObjectId.js.map