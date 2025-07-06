import { DEVICE_PROFILES } from '../config/Profiles';
import { DeviceProfile } from '../types';

export class DeviceProfiles {
  static getProfile(name: string): DeviceProfile | undefined {
    return DEVICE_PROFILES[name];
  }
  static listProfiles(): string[] {
    return Object.keys(DEVICE_PROFILES);
  }
} 