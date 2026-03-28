package com.fleetbo.user.modules

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.fragment.app.Fragment
import com.fleetbo.sdk.FleetboModule

class SampleTab(context: Context, communicator: Any) : FleetboModule(context, communicator) {
    override fun execute(action: String, params: String, callbackId: String) {
        if (action != "tab") return

        runOnUi {
            val activity = context as? AppCompatActivity ?: return@runOnUi
            
            val composeView = ComposeView(context).apply {
                setContent {
                    MaterialTheme {
                        Surface(
                            modifier = Modifier.fillMaxSize(),
                            color = Color(0xFFF8F9FA)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(bottom = 80.dp) // Espace vital pour la Navbar JS
                                    .padding(24.dp),
                                verticalArrangement = Arrangement.Center,
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = "Metal Foundation",
                                    fontSize = 28.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF212529)
                                )
                                Spacer(modifier = Modifier.height(16.dp))
                                Text(
                                    text = "This is a Fleetbo View. The interface is rendered natively at 120 FPS. Use this foundation to build complex and high-performance views.",
                                    fontSize = 16.sp,
                                    color = Color(0xFF6C757D),
                                    textAlign = TextAlign.Center,
                                    lineHeight = 24.sp
                                )
                                Spacer(modifier = Modifier.height(40.dp))
                                Button(
                                    onClick = {
                                        emit(callbackId, "PING_JS", emptyMap())
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0E904D)),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(56.dp)
                                ) {
                                    Text("EMIT SIGNAL TO JS", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
            attachNativeView(composeView)
        }
    }
}
// ⚡ Forged by Alex on 2026-03-28 at 15:04:20
