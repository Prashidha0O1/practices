"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceProfiles = void 0;
const Profiles_1 = require("../config/Profiles");
class DeviceProfiles {
    static getProfile(name) {
        return Profiles_1.DEVICE_PROFILES[name];
    }
    static listProfiles() {
        return Object.keys(Profiles_1.DEVICE_PROFILES);
    }
}
exports.DeviceProfiles = DeviceProfiles;
