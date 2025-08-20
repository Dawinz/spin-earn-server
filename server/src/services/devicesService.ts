import Device from '../models/Device.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

export interface DeviceInfo {
  fingerprintHash: string;
  model: string;
  os: string;
  emulator: boolean;
  rooted: boolean;
  ipAddress?: string;
}

export interface Environment {
  platform: string;
  version: string;
  build: string;
  deviceId: string;
  [key: string]: any;
}

export class DevicesService {
  static async registerDevice(userId: string, deviceInfo: DeviceInfo): Promise<any> {
    try {
      // Check if device already exists
      const existingDevice = await Device.findOne({
        userId,
        fingerprintHash: deviceInfo.fingerprintHash
      });

      if (existingDevice) {
        // Update existing device
        existingDevice.lastIP = deviceInfo.ipAddress || '';
        existingDevice.updatedAt = new Date();
        await existingDevice.save();

        logger.info('Device updated', { userId, deviceId: existingDevice._id });
        return existingDevice;
      }

      // Create new device
      const device = new Device({
        userId,
        fingerprintHash: deviceInfo.fingerprintHash,
        deviceModel: deviceInfo.model,
        os: deviceInfo.os,
        emulator: deviceInfo.emulator,
        rooted: deviceInfo.rooted,
        lastIP: deviceInfo.ipAddress || ''
      });

      await device.save();

      // If this is the first device for the user, make it primary
      const user = await User.findById(userId);
      if (user && !user.devicePrimaryId) {
        user.devicePrimaryId = (device._id as any).toString();
        await user.save();
      }

      logger.info('Device registered', { userId, deviceId: device._id });
      return device;
    } catch (error) {
      logger.error('Error registering device', { userId, error });
      throw error;
    }
  }

  static async reportEnvironment(userId: string, environment: Environment): Promise<void> {
    try {
      // Store environment data (could be in a separate collection or as metadata)
      logger.info('Environment reported', { userId, environment });
      
      // In a real implementation, you might want to:
      // 1. Store this in a separate Environment collection
      // 2. Use it for fraud detection
      // 3. Track app versions and platform usage
      
    } catch (error) {
      logger.error('Error reporting environment', { userId, error });
      throw error;
    }
  }
}
