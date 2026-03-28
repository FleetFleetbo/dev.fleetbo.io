package com.fleetbo.user.modules

import android.content.Context
import android.net.Uri
import android.os.Bundle
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.fragment.app.Fragment
import com.fleetbo.sdk.FleetboModule
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject

class GuestManager(context: Context, communicator: Any) : FleetboModule(context, communicator) {
    override fun execute(action: String, params: String, callbackId: String) {
        if (action == "tab") {
            runOnUi {
                val composeView = ComposeView(context).apply {
                    setContent {
                        MaterialTheme {
                            GuestManagerApp(
                                fetchData = { getDocuments("fleetboDB", "guests") },
                                saveData = { json, uri -> 
                                    if (uri != null) {
                                        saveDocumentWithImage("fleetboDB", "guests", json, uri)
                                    } else {
                                        saveDocument("fleetboDB", "guests", json)
                                    }
                                },
                                deleteData = { id -> deleteDocument("fleetboDB", "guests", id) },
                                emitAction = { act -> emit(callbackId, act, emptyMap()) }
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
fun GuestManagerApp(
    fetchData: suspend () -> String,
    saveData: suspend (String, Uri?) -> String,
    deleteData: suspend (String) -> String,
    emitAction: (String) -> Unit
) {
    var mode by remember { mutableStateOf("list") }
    var guests by remember { mutableStateOf<List<Map<String, String>>>(emptyList()) }
    val scope = rememberCoroutineScope()
    var isLoading by remember { mutableStateOf(true) }

    val loadData = {
        scope.launch {
            isLoading = true
            val result = fetchData()
            try {
                val jsonObject = JSONObject(result)
                if (jsonObject.optBoolean("success", false)) {
                    val dataArray = jsonObject.optJSONArray("data") ?: JSONArray()
                    val parsedList = mutableListOf<Map<String, String>>()
                    for (i in 0 until dataArray.length()) {
                        val item = dataArray.optJSONObject(i)
                        if (item != null) {
                            parsedList.add(
                                mapOf(
                                    "id" to item.optString("id", ""),
                                    "firstName" to item.optString("firstName", ""),
                                    "lastName" to item.optString("lastName", ""),
                                    "imageUrl" to item.optString("imageUrl", "")
                                )
                            )
                        }
                    }
                    guests = parsedList
                }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                isLoading = false
            }
        }
    }

    LaunchedEffect(mode) {
        if (mode == "list") {
            loadData()
        }
    }

    Surface(
        modifier = Modifier.fillMaxSize().padding(bottom = 80.dp),
        color = Color(0xFFF8F9FA)
    ) {
        if (mode == "list") {
            GuestListScreen(
                guests = guests,
                isLoading = isLoading,
                onAddClick = { 
                    emitAction("HIDE_NAVBAR")
                    mode = "creator" 
                },
                onDeleteClick = { id ->
                    scope.launch {
                        isLoading = true
                        deleteData(id)
                        loadData()
                    }
                }
            )
        } else {
            GuestCreatorScreen(
                onCancel = { 
                    emitAction("SHOW_NAVBAR")
                    mode = "list" 
                },
                onSave = { firstName, lastName, uri ->
                    scope.launch {
                        val json = JSONObject().apply {
                            put("firstName", firstName)
                            put("lastName", lastName)
                        }.toString()
                        saveData(json, uri)
                        emitAction("SHOW_NAVBAR")
                        mode = "list"
                    }
                }
            )
        }
    }
}

@Composable
fun GuestListScreen(
    guests: List<Map<String, String>>, 
    isLoading: Boolean, 
    onAddClick: () -> Unit,
    onDeleteClick: (String) -> Unit
) {
    Box(modifier = Modifier.fillMaxSize()) {
        Column(modifier = Modifier.fillMaxSize()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White)
                    .padding(16.dp)
            ) {
                Text(
                    text = "Guest List",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
            }
            
            Box(modifier = Modifier.weight(1f)) {
                if (isLoading) {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center), color = Color(0xFF0E904D))
                } else if (guests.isEmpty()) {
                    Text(
                        text = "No guests yet.",
                        modifier = Modifier.align(Alignment.Center),
                        color = Color.Gray
                    )
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(start = 16.dp, top = 16.dp, end = 16.dp, bottom = 80.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(guests) {
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(16.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(40.dp)
                                            .background(if (it["imageUrl"].isNullOrEmpty()) Color(0xFF0E904D).copy(alpha = 0.1f) else Color(0xFF0E904D), CircleShape),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        if (it["imageUrl"].isNullOrEmpty()) {
                                            Text(
                                                text = it["firstName"]?.take(1) ?: "",
                                                color = Color(0xFF0E904D),
                                                fontWeight = FontWeight.Bold
                                            )
                                        } else {
                                            Text("✓", color = Color.White, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                    
                                    Spacer(modifier = Modifier.width(16.dp))
                                    
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = "${it["firstName"]} ${it["lastName"]}",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 16.sp,
                                            color = Color.Black
                                        )
                                    }
                                    
                                    Box(
                                        modifier = Modifier
                                            .size(36.dp)
                                            .clip(CircleShape)
                                            .background(Color(0xFFFFEBEB))
                                            .clickable { 
                                                it["id"]?.let { id -> 
                                                    if(id.isNotEmpty()) onDeleteClick(id) 
                                                } 
                                            },
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text("✕", color = Color.Red, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        FloatingActionButton(
            onClick = onAddClick,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(16.dp),
            containerColor = Color(0xFF0E904D),
            contentColor = Color.White,
            shape = CircleShape
        ) {
            Text("+", fontSize = 24.sp, modifier = Modifier.padding(bottom = 2.dp))
        }
    }
}

@Composable
fun GuestCreatorScreen(onCancel: () -> Unit, onSave: (String, String, Uri?) -> Unit) {
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    var selectedImageUri by remember { mutableStateOf<Uri?>(null) }
    val activity = LocalContext.current as? AppCompatActivity

    Column(modifier = Modifier.fillMaxSize().background(Color.White)) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                text = "New Guest",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
        }
        
        Column(modifier = Modifier.weight(1f).padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier
                    .size(100.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFF8F9FA))
                    .clickable {
                        activity?.let { act ->
                            val proxy = GuestManagerProxyFragment()
                            proxy.callback = { uri ->
                                if (uri != null) selectedImageUri = uri
                                act.supportFragmentManager.beginTransaction().remove(proxy).commitAllowingStateLoss()
                            }
                            act.supportFragmentManager.beginTransaction().add(proxy, "guest_picker").commitNowAllowingStateLoss()
                        }
                    },
                contentAlignment = Alignment.Center
            ) {
                if (selectedImageUri != null) {
                    Text("Photo OK", color = Color(0xFF0E904D), fontWeight = FontWeight.Bold, fontSize = 14.sp)
                } else {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("+", fontSize = 24.sp, color = Color.Gray)
                        Text("Photo", fontSize = 12.sp, color = Color.Gray)
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            OutlinedTextField(
                value = firstName,
                onValueChange = { firstName = it },
                label = { Text("First Name") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = lastName,
                onValueChange = { lastName = it },
                label = { Text("Last Name") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
        }
        
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            OutlinedButton(
                onClick = onCancel,
                modifier = Modifier.weight(1f).height(50.dp),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("CANCEL", color = Color.Gray)
            }
            Button(
                onClick = {
                    if (firstName.isNotBlank() && lastName.isNotBlank()) {
                        onSave(firstName, lastName, selectedImageUri)
                    }
                },
                modifier = Modifier.weight(1f).height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0E904D)),
                shape = RoundedCornerShape(8.dp),
                enabled = firstName.isNotBlank() && lastName.isNotBlank()
            ) {
                Text("SAVE", color = Color.White)
            }
        }
    }
}

class GuestManagerProxyFragment : Fragment() {
    var callback: ((Uri?) -> Unit)? = null
    private val launcher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        callback?.invoke(uri)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        launcher.launch("image/*")
    }

    override fun onDestroy() {
        super.onDestroy()
        callback?.invoke(null)
    }
}
// ⚡ Forged by Alex on 2026-03-28 at 15:19:50
    Surface(modifier = Modifier.fillMaxSize().padding(bottom = 80.dp), color = Color(0xFFF8F9FA)) {
        Column(modifier = Modifier.fillMaxSize()) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = Color.White,
                shadowElevation = 2.dp
            ) {
                Text(
                    text = "Liste des Invités",
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.padding(16.dp)
                )
            }

            if (isLoading) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Color.Black)
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(guests, key = { it.optString("id", Math.random().toString()) }) { guest ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "${guest.optString("firstName", "Prénom")} ${guest.optString("lastName", "Nom")}",
                                        style = MaterialTheme.typography.bodyLarge
                                    )
                                    val status = guest.optString("status", "En attente")
                                    Text(
                                        text = status,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = if (status == "Confirmé") Color(0xFF4CAF50) else Color.Gray
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Box(modifier = Modifier.padding(16.dp)) {
                Button(
                    onClick = onAddClick,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Black)
                ) {
                    Text("AJOUTER UN INVITÉ", color = Color.White)
                }
            }
        }
    }
}

class GuestListProxyFragment : Fragment()
// ⚡ Forged by Alex on 2026-03-23 at 23:35:44
