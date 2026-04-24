"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = listCategories;
exports.listCategoriesFlat = listCategoriesFlat;
exports.getCategory = getCategory;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const service = __importStar(require("./categories.service"));
const response_1 = require("../../utils/response");
async function listCategories(_req, res, next) {
    try {
        const categories = await service.listCategories();
        (0, response_1.success)(res, { categories });
    }
    catch (err) {
        next(err);
    }
}
async function listCategoriesFlat(_req, res, next) {
    try {
        const categories = await service.listCategoriesFlat();
        (0, response_1.success)(res, { categories });
    }
    catch (err) {
        next(err);
    }
}
async function getCategory(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const category = await service.getCategory(id);
        (0, response_1.success)(res, { category });
    }
    catch (err) {
        next(err);
    }
}
async function createCategory(req, res, next) {
    try {
        const category = await service.createCategory(req.body);
        (0, response_1.success)(res, { category }, "Category created", 201);
    }
    catch (err) {
        next(err);
    }
}
async function updateCategory(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const category = await service.updateCategory(id, req.body);
        (0, response_1.success)(res, { category }, "Category updated");
    }
    catch (err) {
        next(err);
    }
}
async function deleteCategory(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        await service.deleteCategory(id);
        (0, response_1.success)(res, null, "Category deleted");
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=categories.controller.js.map