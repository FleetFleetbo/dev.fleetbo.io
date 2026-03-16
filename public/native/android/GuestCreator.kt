package com.fleetbo.user.modules

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.fragment.app.Fragment
import com.fleetbo.sdk.FleetboModule
import org.json.JSONObject

// @Fleetbo ModuleName: GuestCreator
class GuestCreator(context: Context, communicator: Any) : FleetboModule(context, communicator) {
    override fun execute(action: String, params: String, callbackId: String) {
        val config = JSONObject(params)
        val collectionName = config.optString("collection", "guests")

        runOnUi {
            val activity = context as? AppCompatActivity ?: return@runOnUi
            
            val composeView = ComposeView(context).apply {
                setContent {
                    MaterialTheme {
                        GuestCreatorScreen(
                            onClose = { 
                                removeNativeView(this@apply)
                                sendSuccess(callbackId, "") 
                            },
                            onSubmit = { fName, lName ->
                                launchData(callbackId) {
                                    val json = JSONObject()
                                        .put("firstName", fName)
                                        .put("lastName", lName)
                                        .toString()
                                    
                                    val result = saveDocument("fleetboDB", collectionName, json)
                                    
                                    runOnUi { removeNativeView(this@apply) }
                                    
                                    result
                                }
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
fun GuestCreatorScreen(onClose: () -> Unit, onSubmit: (String, String) -> Unit) {
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    
    Surface(modifier = Modifier.fillMaxSize(), color = Color(0xFFFAF9F6)) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Nouvel Invité", 
                fontFamily = FontFamily.Serif,
                fontWeight = FontWeight.Bold,
                fontSize = 24.sp,
                color = Color(0xFF2C3E50)
            )
            Spacer(modifier = Modifier.height(8.dp))
            HorizontalDivider(color = Color(0xFFD4AF37), thickness = 2.dp)
            Spacer(modifier = Modifier.height(24.dp))
            
            OutlinedTextField(
                value = firstName,
                onValueChange = { firstName = it },
                label = { Text("Prénom") },
                modifier = Modifier.fillMaxWidth(),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White
                )
            )
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = lastName,
                onValueChange = { lastName = it },
                label = { Text("Nom") },
                modifier = Modifier.fillMaxWidth(),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White
                )
            )
            Spacer(modifier = Modifier.height(32.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                TextButton(onClick = onClose) { 
                    Text("ANNULER", color = Color(0xFF2C3E50)) 
                }
                Button(
                    onClick = { onSubmit(firstName, lastName) },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD4AF37))
                ) {
                    Text("ENREGISTRER", color = Color.White)
                }
            }
        }
    }
}

class GuestCreatorProxyFragment : Fragment()
// ⚡ Forged by Alex on 2026-03-13 at 02:49:12