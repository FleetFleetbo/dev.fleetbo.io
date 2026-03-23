package com.fleetbo.user.modules

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.unit.dp
import androidx.fragment.app.Fragment
import com.fleetbo.sdk.FleetboModule
import org.json.JSONArray
import org.json.JSONObject

// @Fleetbo ModuleName: GuestList
class GuestList(context: Context, communicator: Any) : FleetboModule(context, communicator) {
    override fun execute(action: String, params: String, callbackId: String) {
        runOnUi {
            val activity = context as? AppCompatActivity ?: return@runOnUi
            
            val composeView = ComposeView(context).apply {
                setContent {
                    MaterialTheme {
                        GuestListScreen(
                            fetchData = { getDocuments("fleetboDB", "guests") },
                            onAddClick = { emit(callbackId, "OPEN_CREATOR", emptyMap<String, Any>()) }
                        )
                    }
                }
            }
            attachNativeView(composeView)
        }
    }
}

@Composable
fun GuestListScreen(fetchData: suspend () -> String, onAddClick: () -> Unit) {
    var guests by remember { mutableStateOf<List<JSONObject>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        val resultStr = fetchData()
        try {
            val resultJson = JSONObject(resultStr)
            if (resultJson.optBoolean("success", false)) {
                val dataArray = resultJson.optJSONArray("data") ?: JSONArray()
                val parsedList = mutableListOf<JSONObject>()
                for (i in 0 until dataArray.length()) {
                    parsedList.add(dataArray.getJSONObject(i))
                }
                guests = parsedList
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        isLoading = false
    }

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
