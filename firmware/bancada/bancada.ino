/* OdontoRaman Lab — bancada DIDÁTICA com LED, sem laser e sem espectrômetro.
   ESP32 clássico (WROOM-32 / Dev Module). USB 115200. Sem bibliotecas externas.
   GPIO25 -> 470 ohms -> anodo LED demonstrador; catodo -> GND.
   GPIO26 -> 470 ohms -> anodo LED status; catodo -> GND.
   GPIO14 -> contato NO do fim de curso; COM -> GND.
   Tampa fechada deve PRESSIONAR a chave (GPIO14 LOW).
   GPIO27 -> botão -> GND. GPIOs usam INPUT_PULLUP (3,3 V).
   Esta lógica não é intertravamento certificado para laser. */
#include <Arduino.h>
const uint8_t DEMO_LED=25, STATUS_LED=26, LID_PIN=14, BUTTON_PIN=27;
const uint32_t CYCLE_MS=3000, DEBOUNCE_MS=30, HEARTBEAT_MS=1000;
enum State {IDLE, RUNNING, DONE, ABORTED};
State state=IDLE;
bool lastRaw=HIGH, stableButton=HIGH;
uint32_t changedAt=0, startedAt=0, heartbeatAt=0;
const char* stateName(){switch(state){case RUNNING:return "executando";case DONE:return "concluido";case ABORTED:return "interrompido";default:return "pronto";}}
bool lidClosed(){return digitalRead(LID_PIN)==LOW;}
void report(const char* event){
  Serial.print("{\"type\":\"bancada_led\",\"event\":\""); Serial.print(event);
  Serial.print("\",\"state\":\""); Serial.print(stateName());
  Serial.print("\",\"lid_closed\":"); Serial.print(lidClosed()?"true":"false");
  Serial.print(",\"uptime_ms\":"); Serial.print(millis());
  Serial.println(",\"spectrometer\":false}");
}
void setup(){
  pinMode(DEMO_LED,OUTPUT); digitalWrite(DEMO_LED,LOW);
  pinMode(STATUS_LED,OUTPUT); digitalWrite(STATUS_LED,LOW);
  pinMode(LID_PIN,INPUT_PULLUP); pinMode(BUTTON_PIN,INPUT_PULLUP);
  Serial.begin(115200); lastRaw=digitalRead(BUTTON_PIN); stableButton=lastRaw;
  report("inicializacao");
}
void loop(){
  const uint32_t now=millis();
  // Abre a tampa = desliga imediatamente o LED demonstrador.
  if(state==RUNNING && !lidClosed()){digitalWrite(DEMO_LED,LOW);state=ABORTED;report("tampa_aberta");}
  if(state==RUNNING && (uint32_t)(now-startedAt)>=CYCLE_MS){digitalWrite(DEMO_LED,LOW);state=DONE;report("ciclo_finalizado");}
  const bool raw=digitalRead(BUTTON_PIN);
  if(raw!=lastRaw){lastRaw=raw;changedAt=now;}
  if((uint32_t)(now-changedAt)>=DEBOUNCE_MS && raw!=stableButton){
    stableButton=raw;
    if(stableButton==LOW && state!=RUNNING){
      if(lidClosed()){state=RUNNING;startedAt=now;digitalWrite(DEMO_LED,HIGH);report("ciclo_iniciado");}
      else{state=ABORTED;digitalWrite(DEMO_LED,LOW);report("inicio_bloqueado");}
    }
  }
  digitalWrite(STATUS_LED,lidClosed()?HIGH:LOW);
  if((uint32_t)(now-heartbeatAt)>=HEARTBEAT_MS){heartbeatAt=now;report("status");}
}
