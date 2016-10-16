package com.domusguard.domusguard;

import android.bluetooth.BluetoothAdapter;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import com.domusguard.domusguard.login.LoginActivity;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = MainActivity.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (mBluetoothAdapter == null) {
            Log.d(TAG, "Error on Bluetooth");
        }else{
            Log.d(TAG, "Bluetooth initialized");
        }

        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);

    }

    private void setupPreferences(){
        SharedPreferences preferences = this.getApplicationContext().getSharedPreferences("pref", this.getApplicationContext().MODE_PRIVATE);

        preferences.getString("domusguard.url","https://192.168.1.4:3000");
    }
}
