package com.fleetbo.user.modules

import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.fragment.app.Fragment
import com.fleetbo.sdk.Fleetbo
import com.fleetbo.sdk.FleetboModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONObject

class GuestList(context: Context, communicator: Any) : FleetboModule(context, communicator) {
    override fun execute(action: String, params: String, callbackId: String) {
        if (action == "tab") {
            runOnUi {
                val composeView = ComposeView(context).apply {
                    setContent {
                        MaterialTheme {
                            GuestListTabScreen(
                                fetchData = { getDocuments("fleetboDB", "guests") },
                                onGuestClick = { guestId ->
                                    Fleetbo.emit(callbackId, "OPEN_GUEST_DETAILS", mapOf("id" to guestId))
                                },
                                onAddClick = {
                                    Fleetbo.emit(callbackId, "OPEN_CREATOR", emptyMap())
                                }
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
fun GuestListTabScreen(fetchData: suspend () -> String, onGuestClick: (String) -> Unit, onAddClick: () -> Unit) {
    var guests by remember { mutableStateOf<List<Map<String, String>>>(emptyList()) }
    var searchQuery by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        val resultJson = fetchData()
        try {
            val jsonObject = JSONObject(resultJson)
            if (jsonObject.optBoolean("success")) {
                val dataArray = jsonObject.optJSONArray("data")
                val parsedList = mutableListOf<Map<String, String>>()
                if (dataArray != null) {
                    for (i in 0 until dataArray.length()) {
                        val item = dataArray.getJSONObject(i)
                        parsedList.add(
                            mapOf(
                                "id" to item.optString("id", ""),
                                "firstName" to item.optString("firstName", ""),
                                "lastName" to item.optString("lastName", "")
                            )
                        )
                    }
                }
                guests = parsedList
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    val filteredGuests = guests.filter {
        it["firstName"].orEmpty().contains(searchQuery, ignoreCase = true) ||
        it["lastName"].orEmpty().contains(searchQuery, ignoreCase = true)
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFFFAF9F6)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(bottom = 80.dp)
                    .padding(16.dp)
            ) {
                Text(
                    text = "Liste des Invités",
                    fontFamily = FontFamily.Serif,
                    fontWeight = FontWeight.Bold,
                    fontSize = 24.sp,
                    color = Color(0xFF2C3E50)
                )
                Spacer(modifier = Modifier.height(8.dp))
                HorizontalDivider(color = Color(0xFFD4AF37), thickness = 2.dp)
                Spacer(modifier = Modifier.height(16.dp))
                
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    label = { Text("Rechercher un invité") },
                    modifier = Modifier.fillMaxWidth(),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Color.White,
                        unfocusedContainerColor = Color.White
                    )
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                LazyColumn(modifier = Modifier.fillMaxSize()) {
                    items(filteredGuests) {
                        guest ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 8.dp)
                                .clickable { onGuestClick(guest["id"].orEmpty()) },
                            shape = RoundedCornerShape(12.dp),
                            border = BorderStroke(1.dp, Color(0xFFD4AF37)),
                            colors = CardDefaults.cardColors(containerColor = Color.White)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = "${guest["firstName"]} ${guest["lastName"]}",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 18.sp,
                                    color = Color(0xFF2C3E50)
                                )
                            }
                        }
                    }
                }
            }

            FloatingActionButton(
                onClick = onAddClick,
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(end = 16.dp, bottom = 96.dp),
                containerColor = Color(0xFFD4AF37),
                contentColor = Color.White
            ) {
                Icon(
                    painter = painterResource(id = android.R.drawable.ic_menu_add),
                    contentDescription = "Ajouter"
                )
            }
        }
    }
}

class GuestListProxyFragment : Fragment()
// ⚡ Forged by Alex on 2026-03-13 at 02:02:46