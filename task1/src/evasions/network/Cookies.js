"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookiesEvasion = void 0;
class CookiesEvasion {
    getCookies(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield page.cookies();
        });
    }
    setCookie(page, cookie) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.setCookie(cookie);
        });
    }
    deleteCookie(page, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = yield page.cookies();
            const cookie = cookies.find((c) => c.name === name);
            if (cookie) {
                yield page.deleteCookie(cookie);
            }
        });
    }
}
exports.CookiesEvasion = CookiesEvasion;
