package com.fleetbo.user.modules

import android.content.Context
import android.net.Uri
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.unit.dp
import androidx.fragment.app.Fragment
import com.fleetbo.sdk.FleetboModule
import org.json.JSONObject

// @Fleetbo ModuleName: ProfileCreator
class ProfileCreator(context: Context, communicator: Any) : FleetboModule(context, communicator) {
    override fun execute(action: String, params: String, callbackId: String) {
        val config = JSONObject(params)
        val collectionName = config.optString("collection", "users")

        runOnUi {
            val activity = context as? AppCompatActivity ?: return@runOnUi
            
            val composeView = ComposeView(context).apply {
                setContent {
                    MaterialTheme {
                        ProfileScreen(
                            onClose = { 
                                removeNativeView(this@apply)
                                sendSuccess(callbackId, "") 
                            },
                            onSubmit = { name, bio, phone, uri ->
                                launchData(callbackId) {
                                    val json = JSONObject()
                                        .put("name", name)
                                        .put("bio", bio)
                                        .put("phone", phone)
                                        .toString()
                                        
                                    val finalResult = if (uri != null) {
                                        saveDocumentWithImage("fleetboDB", collectionName, json, uri)
                                    } else {
                                        saveDocument("fleetboDB", collectionName, json)
                                    }
                                    
                                    runOnUi {
                                        removeNativeView(this@apply)
                                    }
                                    
                                    finalResult
                                }
                            },
                            activity = activity
                        )
                    }
                }
            }
            attachNativeView(composeView)
        }
    }
}

@Composable
fun ProfileScreen(onClose: () -> Unit, onSubmit: (String, String, String, Uri?) -> Unit, activity: AppCompatActivity) {
    var name by remember { mutableStateOf("") }
    var bio by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var selectedImageUri by remember { mutableStateOf<Uri?>(null) }
    
    Surface(modifier = Modifier.fillMaxSize(), color = Color.White) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Créer un Profil", style = MaterialTheme.typography.headlineSmall)
            Spacer(modifier = Modifier.height(16.dp))
            
            Button(
                onClick = {
                    val proxy = ProfileCreatorProxyFragment()
                    proxy.callback = { uri -> selectedImageUri = uri }
                    activity.supportFragmentManager.beginTransaction()
                        .add(proxy, "profile_image_picker")
                        .commitNowAllowingStateLoss()
                }, 
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(if (selectedImageUri != null) "IMAGE SÉLECTIONNÉE" else "CHOISIR UNE IMAGE")
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Nom") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = bio,
                onValueChange = { bio = it },
                label = { Text("Bio") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = phone,
                onValueChange = { phone = it },
                label = { Text("Téléphone") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(24.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                TextButton(onClick = onClose) { Text("ANNULER", color = Color.Gray) }
                Button(onClick = { onSubmit(name, bio, phone, selectedImageUri) }) {
                    Text("ENREGISTRER")
                }
            }
        }
    }
}

class ProfileCreatorProxyFragment : Fragment() {
    var callback: ((Uri?) -> Unit)? = null
    
    private val launcher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        callback?.invoke(uri)
        parentFragmentManager.beginTransaction().remove(this).commitAllowingStateLoss()
    }

    override fun onCreate(savedInstanceState: android.os.Bundle?) {
        super.onCreate(savedInstanceState)
        launcher.launch("image/*")
    }
    
    override fun onDestroy() {
        super.onDestroy()
        callback?.invoke(null)
    }
}
// ⚡ Forged by Alex on 2026-03-11 at 23:10:26