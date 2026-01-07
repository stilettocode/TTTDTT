using System;
using UnityEngine;
using SocketIOClient;
using Newtonsoft.Json;

public class SocketIOTelemetryClient : MonoBehaviour
{
    [Header("Connection")]
    [Tooltip("Socket.IO server URL (e.g., http://localhost:5001)")]
    public string serverUrl = "http://localhost:5001";
    
    private SocketIOClient.SocketIO socket;
    private TelemetryData currentData;
    
    // Events
    public event Action<TelemetryData> OnTelemetryReceived;
    
    void Start()
    {
        Connect();
    }
    
    void OnDestroy()
    {
        Disconnect();
    }
    
    void OnApplicationQuit()
    {
        Disconnect();
    }
    
    private async void Connect()
    {
        try
        {
            socket = new SocketIOClient.SocketIO(serverUrl, new SocketIOOptions
            {
                Reconnection = true,
                ReconnectionDelay = 1000,
                ReconnectionAttempts = 5
            });
            
            socket.OnConnected += (sender, e) =>
            {
                Debug.Log("[SocketIO] Connected");
            };
            
            socket.OnDisconnected += (sender, e) =>
            {
                Debug.Log("[SocketIO] Disconnected");
            };
            
            socket.On("telemetry", response =>
            {
                try
                {
                    string json = response.GetValue<string>();
                    currentData = JsonConvert.DeserializeObject<TelemetryData>(json);
                    
                    if (currentData != null)
                    {
                        OnTelemetryReceived?.Invoke(currentData);
                        Debug.Log($"[SocketIO] Received telemetry - EVA Time: {currentData.telemetry.eva_time}");
                    }
                }
                catch (Exception ex)
                {
                    Debug.LogError($"[SocketIO] Parse error: {ex.Message}");
                }
            });
            
            socket.On("error", response =>
            {
                var errorData = response.GetValue<ErrorData>();
                Debug.LogError($"[SocketIO] Error: {errorData.error}");
            });
            
            await socket.ConnectAsync();
        }
        catch (Exception ex)
        {
            Debug.LogError($"[SocketIO] Connection error: {ex.Message}");
        }
    }
    
    private async void Disconnect()
    {
        if (socket != null)
        {
            await socket.DisconnectAsync();
            socket.Dispose();
            socket = null;
        }
    }
    
    public TelemetryData GetCurrentData()
    {
        return currentData;
    }
}

[Serializable]
public class TelemetryData
{
    public TelemetryInfo telemetry;
}

[Serializable]
public class TelemetryInfo
{
    public float eva_time;
    public EvaData eva1;
    public EvaData eva2;
}

[Serializable]
public class EvaData
{
    public float batt_time_left;
    public float oxy_pri_storage;
    public float oxy_sec_storage;
    public float oxy_pri_pressure;
    public float oxy_sec_pressure;
    public float oxy_time_left;
    public float heart_rate;
    public float oxy_consumption;
    public float co2_production;
    public float suit_pressure_oxy;
    public float suit_pressure_co2;
    public float suit_pressure_other;
    public float suit_pressure_total;
    public float fan_pri_rpm;
    public float fan_sec_rpm;
    public float helmet_pressure_co2;
    public float scrubber_a_co2_storage;
    public float scrubber_b_co2_storage;
    public float temperature;
    public float coolant_ml;
    public float coolant_gas_pressure;
    public float coolant_liquid_pressure;
}

[Serializable]
public class ErrorData
{
    public string error;
    public string local_timestamp;
}

