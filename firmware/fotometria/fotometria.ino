/* OdontoRaman 3.3 — leitura óptica real: OPT101 + ADS1115 + ESP32 clássico.
   Este firmware NÃO energiza o laser: não há GPIO de acionamento.
   A fonte de 3,0 V do módulo passa por chave, contato da tampa e botão
   momentâneo de emissão em série. Consulte docs/Projeto_Laser.md.
   I2C: SDA 21, SCL 22; ADS1115 em 0x48, A0 = saída do OPT101.
   ADS1115 e OPT101: 3,3 V. OPT101 pinos 4 e 5 unidos; 3 e 8 ao GND.
   GPIO14: contato auxiliar NO da tampa para GND; INPUT_PULLUP.
   GPIO34: monitor da alimentação do módulo após as chaves: série 10k,
   pull-down 100k para GND. Nunca aplicar 5 V. GNDs em comum.
   USB 115200 baud. 20 registros/s. Não gera espectro Raman.
   O estado laser_powered é elétrico; NÃO comprova emissão óptica.
*/
#include <Wire.h>
const uint8_t ADC_ADDR=0x48, LID_PIN=14, POWER_SENSE=34;
uint32_t lastSample=0, sequence=0;
bool adcReady=false;
bool writeRegister(uint8_t reg,uint16_t value){
 Wire.beginTransmission(ADC_ADDR);Wire.write(reg);Wire.write(uint8_t(value>>8));Wire.write(uint8_t(value));return Wire.endTransmission()==0;
}
bool readRegister(uint8_t reg,int16_t &value){
 Wire.beginTransmission(ADC_ADDR);Wire.write(reg);
 if(Wire.endTransmission(false)!=0)return false;
 if(Wire.requestFrom(ADC_ADDR,uint8_t(2))!=2)return false;
 value=int16_t((uint16_t(Wire.read())<<8)|Wire.read());return true;
}
void setup(){
 pinMode(LID_PIN,INPUT_PULLUP);pinMode(POWER_SENSE,INPUT);
 Serial.begin(115200);Wire.begin(21,22);Wire.setClock(100000);Wire.setTimeOut(25);
 // AIN0-GND, faixa ±4,096 V, contínuo, 128 SPS, comparador desativado.
 adcReady=writeRegister(1,0xC283);
 Serial.println(adcReady?"{\"type\":\"photometry_status\",\"message\":\"ADC pronto; apenas leitura\"}":"{\"type\":\"photometry_error\",\"message\":\"ADS1115 ausente em 0x48; desligue e confira I2C\"}");
}
void loop(){
 const uint32_t now=millis();if(uint32_t(now-lastSample)<50)return;lastSample=now;
 if(!adcReady)return;
 int16_t raw;if(!readRegister(0,raw)){adcReady=false;Serial.println("{\"type\":\"photometry_error\",\"message\":\"Falha I2C; aquisicao interrompida\"}");return;}
 Serial.printf("{\"type\":\"laser_photometry\",\"version\":1,\"sequence\":%lu,\"uptime_ms\":%lu,\"adc_counts\":%d,\"voltage_v\":%.6f,\"lid_closed\":%s,\"laser_powered\":%s,\"spectrometer\":false}\n",
  (unsigned long)++sequence,(unsigned long)now,raw,double(raw)*0.000125,digitalRead(LID_PIN)==LOW?"true":"false",digitalRead(POWER_SENSE)==HIGH?"true":"false");
}
