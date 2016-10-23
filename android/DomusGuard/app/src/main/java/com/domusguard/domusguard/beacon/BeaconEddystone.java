package com.domusguard.domusguard.beacon;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.os.ParcelUuid;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Random;

/**
 * Created by qstepis on 16/10/2016.
 */

public class BeaconEddystone {

    private static final String TAG = BeaconEddystone.class.getSimpleName();
    private static String namespace = "41414141414141414141";
    private static final String instance = "414243414243";
    private static final byte txPowerLevel = AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM;
    private static final int advertiseMode = AdvertiseSettings.ADVERTISE_MODE_LOW_POWER;
    private static final ParcelUuid SERVICE_UUID = ParcelUuid.fromString("0000FEAA-0000-1000-8000-00805F9B34FB");
    //private static final ParcelUuid SERVICE_UUID = ParcelUuid.fromString("00000000-0000-0000-0000-000000000000");
    private static final byte FRAME_TYPE_UID = 0x00;

    private BluetoothLeAdvertiser adv;
    private AdvertiseCallback  advertiseCallback;

    public BeaconEddystone(BluetoothAdapter btAdapter){
        init(btAdapter);
        startAdvertising();
    }

    private void init(BluetoothAdapter btAdapter) {
        if(!btAdapter.isMultipleAdvertisementSupported()) {
            Log.e(TAG, "BLE advertising not supported on this device");
        } else {
            adv = btAdapter.getBluetoothLeAdvertiser();
            advertiseCallback = createAdvertiseCallback();
        }
    }


    private void startAdvertising() {
        Log.i(TAG, "Starting ADV, Tx power = " + txPowerLevel + ", mode = " + advertiseMode);
        if (!isValidHex(namespace, 10)) {
            //namespace.setError("not 10-byte hex");
            ///txSwitch.setChecked(false);
            Log.e(TAG, "not 10-byte hex");
            return;
        }
        if (!isValidHex(instance, 6)) {
            //instance.setError("not 6-byte hex");
            //txSwitch.setChecked(false);
            Log.e(TAG, "not 6-byte hex");
            return;
        }

        AdvertiseSettings advertiseSettings = new AdvertiseSettings.Builder()
                .setAdvertiseMode(advertiseMode)
                .setTxPowerLevel(txPowerLevel)
                .setConnectable(false)
//                .setTimeout(1000)
                .build();

        byte[] serviceData = null;
        try {
            serviceData = buildServiceData();
        } catch (IOException e) {
            Log.e(TAG, e.toString());
            //Toast.makeText(this, "failed to build service data", Toast.LENGTH_SHORT).show();
            //txSwitch.setChecked(false);
        }

        AdvertiseData advertiseData = new AdvertiseData.Builder()
                .addServiceData(SERVICE_UUID, serviceData)
                .addServiceUuid(SERVICE_UUID)
                .setIncludeTxPowerLevel(false)
                .setIncludeDeviceName(false)
                .build();

       //while(true) {
            adv.startAdvertising(advertiseSettings, advertiseData, advertiseCallback);

         /*   try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
*/
       // }

    }


    private byte[] buildServiceData() throws IOException {
        byte[] namespaceBytes = toByteArray(namespace);
        byte[] instanceBytes = toByteArray(instance);
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        os.write(new byte[]{FRAME_TYPE_UID, txPowerLevel});
        os.write(namespaceBytes);
        os.write(instanceBytes);
        return os.toByteArray();
    }


    private AdvertiseCallback createAdvertiseCallback() {
        return new AdvertiseCallback() {
            @Override
            public void onStartFailure(int errorCode) {
                switch (errorCode) {
                    case ADVERTISE_FAILED_DATA_TOO_LARGE:
                        Log.e(TAG, "ADVERTISE_FAILED_DATA_TOO_LARGE");
                        break;
                    case ADVERTISE_FAILED_TOO_MANY_ADVERTISERS:
                        Log.e(TAG, "ADVERTISE_FAILED_TOO_MANY_ADVERTISERS");
                        break;
                    case ADVERTISE_FAILED_ALREADY_STARTED:
                        Log.e(TAG, "ADVERTISE_FAILED_ALREADY_STARTED");
                        break;
                    case ADVERTISE_FAILED_INTERNAL_ERROR:
                        Log.e(TAG, "ADVERTISE_FAILED_INTERNAL_ERROR");
                        break;
                    case ADVERTISE_FAILED_FEATURE_UNSUPPORTED:
                        Log.e(TAG, "ADVERTISE_FAILED_FEATURE_UNSUPPORTED");
                        break;
                    default:
                        Log.e(TAG, "startAdvertising failed with unknown error " + errorCode);
                        break;
                }
            };

            @Override
            public void onStartSuccess(AdvertiseSettings settingsInEffect){
                Log.i(TAG, "start Advetise...");
            }
        };
    }

    private boolean isValidHex(String s, int len) {
        return !(s == null || s.isEmpty()) && s.length() == len*2 && s.matches("[0-9A-F]+");
    }

    private byte[] toByteArray(String hexString) {
        // hexString guaranteed valid.
        int len = hexString.length();
        byte[] bytes = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            bytes[i / 2] = (byte) ((Character.digit(hexString.charAt(i), 16) << 4)
                    + Character.digit(hexString.charAt(i + 1), 16));
        }
        return bytes;
    }
/*
    private String randomHexString(int length) {
        byte[] buf = new byte[length];
        new Random().nextBytes(buf);
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            stringBuilder.append(String.format("%02X", buf[i]));
        }
        return stringBuilder.toString();
    }
*/


}
