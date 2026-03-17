package com.fleetbo.user.modules

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.fleetbo.sdk.FleetboModule
import org.json.JSONObject

class testModule(context: Context, communicator: Any) : FleetboModule(context, communicator) {
    override fun execute(action: String, params: String, callbackId: String) {
        val config = try { JSONObject(params) } catch (e: Exception) { JSONObject() }
        val titleText = config.optString("title", "Titre par défaut")
        val imageUrl = config.optString("imageUrl", "https://fleetbo.io/images/console/gallery/5.png")

        runOnUi {
            val activity = context as? AppCompatActivity ?: return@runOnUi
            
            val composeView = ComposeView(context).apply {
                setContent {
                    MaterialTheme {
                        TestModuleScreen(
                            title = titleText,
                            imageUrl = imageUrl,
                            onClose = { 
                                removeNativeView(this@apply)
                                sendSuccess(callbackId, "{\"status\": \"closed\"}") 
                            }
                        )
                    }
                }
            }
            attachNativeView(composeView)
        }
    }
}

@Composable
fun TestModuleScreen(title: String, imageUrl: String, onClose: () -> Unit) {
    Surface(modifier = Modifier.fillMaxSize(), color = Color.White) {
        Column(
            modifier = Modifier.padding(24.dp).fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Image positionnée au-dessus du titre
            AsyncImage(
                model = imageUrl,
                contentDescription = "Image principale",
                modifier = Modifier
                    .size(200.dp)
                    .padding(bottom = 24.dp)
            )
            
            Text(
                text = title,
                style = MaterialTheme.typography.headlineMedium,
                color = Color.Black
            )
            
            Spacer(modifier = Modifier.height(48.dp))
            
            Button(onClick = onClose) {
                Text("FERMER")
            }
        }
    }
}
// ⚡ Forged by Alex on 2026-03-17 at 05:08:13