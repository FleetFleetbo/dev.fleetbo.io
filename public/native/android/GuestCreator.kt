package com.fleetbo.user.modules

import android.content.Context
import android.net.Uri
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.unit.dp
import androidx.fragment.app.Fragment
import coil.compose.rememberAsyncImagePainter
import com.fleetbo.sdk.FleetboModule
import org.json.JSONObject

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
                            onPickImage = { onImagePicked ->
                                val proxy = GuestCreatorProxyFragment()
                                proxy.callback = { uri -> onImagePicked(uri) }
                                activity.supportFragmentManager.beginTransaction()
                                    .add(proxy, "guest_creator_proxy")
                                    .commitNowAllowingStateLoss()
                            },
                            onSubmit = { firstName, lastName, uri ->
                                launchData(callbackId) {
                                    val json = JSONObject()
                                        .put("firstName", firstName)
                                        .put("lastName", lastName)
                                        .toString()
                                        
                                    val finalResult = if (uri != null) {
                                        saveDocumentWithImage("fleetboDB", collectionName, json, uri)
                                    } else {
                                        saveDocument("fleetboDB", collectionName, json)
                                    }
                                    
                                    runOnUi { removeNativeView(this@apply) }
                                    
                                    finalResult
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
fun GuestCreatorScreen(
    onClose: () -> Unit, 
    onPickImage: ((Uri?) -> Unit) -> Unit,
    onSubmit: (String, String, Uri?) -> Unit
) {
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    var selectedImageUri by remember { mutableStateOf<Uri?>(null) }
    
    Surface(modifier = Modifier.fillMaxSize(), color = Color.White) {
        Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Text("Nouveau Guest", style = MaterialTheme.typography.headlineSmall)
            Spacer(modifier = Modifier.height(24.dp))
            
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .clip(CircleShape)
                    .background(Color.LightGray)
                    .clickable {
                        onPickImage { uri -> 
                            if (uri != null) selectedImageUri = uri 
                        }
                    },
                contentAlignment = Alignment.Center
            ) {
                if (selectedImageUri != null) {
                    Image(
                        painter = rememberAsyncImagePainter(selectedImageUri),
                        contentDescription = "Profile Photo",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Text("Photo", color = Color.DarkGray)
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            OutlinedTextField(
                value = firstName,
                onValueChange = { firstName = it },
                label = { Text("Prénom") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = lastName,
                onValueChange = { lastName = it },
                label = { Text("Nom") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(32.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                TextButton(onClick = onClose) { Text("ANNULER", color = Color.Gray) }
                Button(
                    onClick = { onSubmit(firstName, lastName, selectedImageUri) },
                    enabled = firstName.isNotBlank() && lastName.isNotBlank()
                ) {
                    Text("ENREGISTRER")
                }
            }
        }
    }
}

class GuestCreatorProxyFragment : Fragment() {
    var callback: ((Uri?) -> Unit)? = null
    
    private val launcher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        callback?.invoke(uri)
        parentFragmentManager.beginTransaction().remove(this).commitAllowingStateLoss()
    }

    override fun onCreate(savedInstanceState: android.os.Bundle?) {
        super.onCreate(savedInstanceState)
        launcher.launch("image/*")
    }
}
// ⚡ Forged by Alex on 2026-03-23 at 16:34:04
