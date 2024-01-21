package com.trooapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Handler;
import android.view.View;
import android.view.WindowManager;
import android.widget.ProgressBar;

import com.trooapp.R;

import android.os.Bundle;

public class SplashActivity extends AppCompatActivity {

    private ProgressBar progressBar;
    private int progress = 10;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        View decorView = getWindow().getDecorView();
        int uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN;
        decorView.setSystemUiVisibility(uiOptions);

        progressBar = findViewById(R.id.ProgressBarId);

        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                mysplash();
                Intent intent = new Intent(SplashActivity.this, MainActivity.class);
                startActivity(intent);
                finish();
            }
        });
        thread.start();
    }

    private void mysplash() {
        for (progress = 10; progress <= 100; progress = progress + 10) {
            try {
                progressBar.setProgress(progress);
                Thread.sleep(300);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}