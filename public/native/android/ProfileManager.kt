package com.fleetbo.user.modules

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.fragment.app.Fragment
import com.fleetbo.sdk.FleetboModule
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeoutOrNull
import org.json.JSONObject

class ProfileManager(context: Context, communicator: Any) : FleetboModule(context, communicator) {
    override fun execute(action: String, params: String, callbackId: String) {
        if (action == "tab") {
            runOnUi {
                val activity = context as? AppCompatActivity ?: return@runOnUi
                
                val composeView = ComposeView(context).apply {
                    setContent {
                        MaterialTheme {
                            var refreshTrigger by remember { mutableStateOf(0) }
                            
                            ProfileScreen(
                                onEditProfile = { 
                                    emit(callbackId, "OPEN_EDIT_PROFILE", emptyMap())
                                },
                                onLogout = {
                                    emit(callbackId, "LOGOUT", emptyMap())
                                },
                                onSaveProfile = { newUsername, newPhone ->
                                    val uid = getAuthUid() ?: ""
                                    val json = JSONObject()
                                        .put("userId", uid)
                                        .put("username", newUsername)
                                        .put("phoneNumber", newPhone)
                                        .put("dateCreated", "2026-03-28")
                                        .toString()
                                    saveDocument("fleetboDB", "users", json)
                                },
                                fetchProfile = {
                                    val uid = getAuthUid()
                                    if (!uid.isNullOrEmpty()) {
                                        getUserDocuments("fleetboDB", "users")
                                    } else {
                                        ""
                                    }
                                },
                                refreshTrigger = refreshTrigger,
                                onRefresh = { refreshTrigger += 1 }
                            )
                        }
                    }
                }
                attachNativeView(composeView)
            }
        }
    }
}

@Composable
fun ProfileScreen(
    onEditProfile: () -> Unit, 
    onLogout: () -> Unit, 
    onSaveProfile: suspend (String, String) -> Unit,
    fetchProfile: suspend () -> String,
    refreshTrigger: Int,
    onRefresh: () -> Unit
) {
    var username by remember { mutableStateOf("") }
    var phoneNumber by remember { mutableStateOf("") }
    var dateCreated by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(true) }
    var hasProfile by remember { mutableStateOf(false) }

    var inputUsername by remember { mutableStateOf("") }
    var inputPhone by remember { mutableStateOf("") }
    
    val scope = rememberCoroutineScope()

    val avatarLetter by remember { derivedStateOf { if (username.isNotEmpty()) username.take(1).uppercase() else "?" } }
    val isFormValid by remember { derivedStateOf { inputUsername.isNotBlank() && inputPhone.isNotBlank() } }

    LaunchedEffect(refreshTrigger) {
        isLoading = true
        try {
            val res = withTimeoutOrNull(8000L) { fetchProfile() }
            if (!res.isNullOrEmpty()) {
                val json = JSONObject(res)
                if (json.optBoolean("success")) {
                    val dataArray = json.optJSONArray("data")
                    if (dataArray != null && dataArray.length() > 0) {
                        val data = dataArray.getJSONObject(0)
                        username = data.optString("username", "Unknown user")
                        phoneNumber = data.optString("phoneNumber", "Not provided")
                        dateCreated = data.optString("dateCreated", "")
                        hasProfile = true
                    } else {
                        hasProfile = false
                    }
                } else {
                    hasProfile = false
                }
            } else {
                hasProfile = false
            }
        } catch (e: Exception) {
            e.printStackTrace()
            hasProfile = false
        } finally {
            isLoading = false
        }
    }

    Surface(
        modifier = Modifier.fillMaxSize().padding(bottom = 80.dp), 
        color = Color(0xFFF8F9FA)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            if (isLoading) {
                CircularProgressIndicator(color = Color(0xFF0E904D))
            } else if (hasProfile) {
                Box(
                    modifier = Modifier
                        .size(100.dp)
                        .background(Color(0xFF0E904D), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = avatarLetter,
                        color = Color.White,
                        fontSize = 40.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                Spacer(modifier = Modifier.height(24.dp))
                
                Text(text = username, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = phoneNumber, fontSize = 16.sp, color = Color.DarkGray)
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = if (dateCreated.isNotEmpty()) "Member since: $dateCreated" else "", fontSize = 14.sp, color = Color.Gray)

                Spacer(modifier = Modifier.height(48.dp))
                
                Button(
                    onClick = onEditProfile,
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Black),
                    modifier = Modifier.fillMaxWidth(0.8f).height(50.dp)
                ) {
                    Text("EDIT PROFILE", color = Color.White, fontWeight = FontWeight.Bold)
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Button(
                    onClick = onLogout,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDC3545)),
                    modifier = Modifier.fillMaxWidth(0.8f).height(50.dp)
                ) {
                    Text("LOGOUT", color = Color.White, fontWeight = FontWeight.Bold)
                }
            } else {
                Text(text = "Create your profile", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = "Please provide your information.", fontSize = 14.sp, color = Color.Gray)

                Spacer(modifier = Modifier.height(32.dp))
                
                OutlinedTextField(
                    value = inputUsername,
                    onValueChange = { inputUsername = it },
                    label = { Text("Username") },
                    modifier = Modifier.fillMaxWidth()
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                OutlinedTextField(
                    value = inputPhone,
                    onValueChange = { inputPhone = it },
                    label = { Text("Phone number") },
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(48.dp))
                
                Button(
                    onClick = { 
                        if (isFormValid) {
                            isLoading = true
                            scope.launch {
                                try {
                                    onSaveProfile(inputUsername, inputPhone)
                                } catch (e: Exception) {
                                    e.printStackTrace()
                                } finally {
                                    onRefresh()
                                }
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isFormValid) Color(0xFF0E904D) else Color.LightGray
                    ),
                    enabled = isFormValid,
                    modifier = Modifier.fillMaxWidth(0.8f).height(50.dp)
                ) {
                    Text("SAVE", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

class ProfileManagerProxyFragment : Fragment() {
    // Requis par le contrat d'architecture même si inutilisé ici
}
// ⚡ Forged by Alex on 2026-03-28 at 23:03:31
