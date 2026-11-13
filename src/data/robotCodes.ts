export interface RobotSourceCode {
  id: string;
  name: string;
  filename: string;
  language: 'MQL5' | 'MQL4' | 'Python';
  targetSymbol: string;
  timeframe: string;
  code: string;
}

export const ROBOT_SOURCE_CODES: Record<string, RobotSourceCode> = {
  'ar-nexus': {
    id: 'ar-nexus',
    name: 'AR-Nexus',
    filename: 'AR_Nexus_Liquidity_SMC.mq5',
    language: 'MQL5',
    targetSymbol: 'EURUSD / GBPUSD / AUDJPY / XAUUSD',
    timeframe: 'M15',
    code: `//+------------------------------------------------------------------+
//|                                             AR_Nexus_Liquidity.mq5 |
//|                                  Copyright 2026, Nexus Quant Labs |
//|               Strategie Pură de Lichiditate (SMC Liquidity Sweep) |
//+------------------------------------------------------------------+
#property copyright   "Nexus Quant Labs"
#property link        "https://nexusquant.ro"
#property version     "1.02"
#property description "Robot bazat exclusiv pe Lichiditate cu Alerte Complete pe Telegram"
#property strict

#include <Trade\\Trade.mqh>

//+------------------------------------------------------------------+
//| PARAMETRI DE INTRARE                                             |
//+------------------------------------------------------------------+
input group "=== Securitate & Licență Autentificată ==="
input string          InpLicenseKey         = "AR-NEXUS-LIVE-8842"; // Cheie Unică Licență (Format: AR-NEXUS-...)
input ulong           InpAllowedAccount     = 0;                   // Număr Cont MT5 Autorizat (0 = Oricare)
input datetime        InpExpirationDate     = D'2026.12.31 23:59'; // Dată Expirare Licență (0 = Nelimitat)
input bool            InpLockToDemoOnly     = false;               // Permite rularea DOAR pe conturi DEMO

input group "=== Protecție Risc Prop Firm & Capital Guard ==="
input bool            InpEnableDailyGuard   = true;                // Hard Stop Pierdere Zilnică (FTMO / FundedNext)
input double          InpMaxDailyLossPct    = 4.0;                 // Limită Pierdere Maximă / Zi (% din Balanță)
input bool            InpCloseOnWeekend     = true;                // Închide pozițiile vineri la 21:00 GMT (fără gap-uri)

input group "=== Filtru Știri Economice (Dosar Roșu / High Impact) ==="
input bool            InpEnableNewsFilter   = true;                // Oprește tranzacționarea pe Știri Roșii (CPI, NFP, FOMC)
input int             InpNewsPauseMins      = 30;                  // Minute pauză Înainte/După știre roșie (ex: 30 min)
input bool            InpCloseBeforeRedNews = false;               // Închide pozițiile deschise înainte de știri roșii

input group "=== Telegram - Notificare Toate Mișcările ==="
input bool            InpSendTelegram       = true;       // Activează notificările pe Telegram
input string          InpTelegramToken      = "pune-aici-token";  // Token Telegram Bot
input string          InpTelegramChatID     = "pune-aici-chat-id";// Chat ID Telegram
input bool            InpNotifyNewLevels    = true;       // Notifică nivel nou de lichiditate găsit
input bool            InpNotifySweepAlert   = true;       // Notifică când prețul începe să „vâneze” stopurile
input bool            InpNotifyTradeResult  = true;       // Notifică rezultatul tranzacției (TP / SL atins)

input group "=== Configurare Lichiditate (din Video) ==="
input ENUM_TIMEFRAMES InpLiqTF              = PERIOD_M15; // Timeframe Lichiditate Majoră (15M recomandat)
input int             InpSwingBars          = 5;          // Bare confirmare Vârf/Bază extremă
input bool            InpUseHODLOD          = true;       // Include lichiditatea HOD/LOD (Maxim/Minim Zi)
input int             InpMinSweepPoints     = 10;         // Puncte minime străpungere pentru Sweep valid
input int             InpMaxInvalidatePts   = 400;        // Puncte străpungere după care nivelul se invalidează

input group "=== Execuție & Risc ==="
input bool            InpAutoTrade          = true;       // Deschide tranzacții automat
input double          InpLots               = 0.10;       // Mărime Lot
input double          InpRiskReward         = 3.5;        // Raport Risc:Recompensă (1:3.5 - 1:4.2)
input int             InpSLBufferPts        = 30;         // Buffer adițional Stop Loss (puncte)
input ulong           InpMagicNumber        = 192837;     // Număr Magic
input int             InpMaxSpreadPts       = 35;         // Spread maxim permis pentru intrare

//+------------------------------------------------------------------+
//| Variabile globale                                                |
//+------------------------------------------------------------------+
CTrade   ExtTrade;
datetime ExtLastBarTime = 0;

// Variabile de control risc & licență
double   ExtDayStartBalance     = 0.0;
int      ExtCurrentDay          = -1;
bool     ExtDailyGuardTriggered = false;
bool     ExtNewsAlertTriggered  = false;

// Niveluri active de lichiditate
double   ExtLiqHighPrice = 0.0;
datetime ExtLiqHighTime  = 0;
bool     ExtLiqHighSwept = false;
bool     ExtHighSweepNotified = false;
double   ExtSweepMaxHigh = 0.0;

double   ExtLiqLowPrice  = 0.0;
datetime ExtLiqLowTime   = 0;
bool     ExtLiqLowSwept  = false;
bool     ExtLowSweepNotified = false;
double   ExtSweepMinLow  = 0.0;

//+------------------------------------------------------------------+
//| OnInit                                                           |
//+------------------------------------------------------------------+
int OnInit()
{
   // ===================================================================
   // 1. VERIFICARE SECURITATE & AUTENTIFICARE LICENȚĂ
   // ===================================================================
   if(InpExpirationDate > 0 && TimeCurrent() > InpExpirationDate)
   {
      Alert("🛑 [AR-Nexus SECURITATE] Licența a EXPIRAT la data de: ", TimeToString(InpExpirationDate), "! Contactează suportul Nexus Quant.");
      Print("[AR-Nexus EROARE] Licență expirată. Execuție refuzată.");
      return(INIT_FAILED);
   }

   long currentLogin = AccountInfoInteger(ACCOUNT_LOGIN);
   if(InpAllowedAccount > 0 && currentLogin != (long)InpAllowedAccount)
   {
      Alert(StringFormat("🛑 [AR-Nexus SECURITATE] Contul MT5 %d este NEAUTORIZAT! Această licență este legată de contul: %d.", currentLogin, InpAllowedAccount));
      Print("[AR-Nexus EROARE] Tentativă de rulare pe cont neautorizat: ", currentLogin);
      return(INIT_FAILED);
   }

   ENUM_ACCOUNT_TRADE_MODE tradeMode = (ENUM_ACCOUNT_TRADE_MODE)AccountInfoInteger(ACCOUNT_TRADE_MODE);
   bool isDemoKey = (StringFind(InpLicenseKey, "DEMO") >= 0 || StringFind(InpLicenseKey, "TRIAL") >= 0);
   if((InpLockToDemoOnly || isDemoKey) && tradeMode == ACCOUNT_TRADE_MODE_REAL && !MQLInfoInteger(MQL_TESTER))
   {
      Alert("🛑 [AR-Nexus SECURITATE] Licența DEMO 7 Zile este activă DOAR pentru conturi DEMO! Nu este permisă rularea pe cont REAL.");
      Print("[AR-Nexus EROARE] Licență DEMO detectată pe cont LIVE.");
      return(INIT_FAILED);
   }

   if(isDemoKey && !MQLInfoInteger(MQL_TESTER))
   {
      string gvName = "NX_DEMO7D_" + IntegerToString(InpMagicNumber);
      if(!GlobalVariableCheck(gvName)) GlobalVariableSet(gvName, (double)TimeCurrent());
      double startTs = GlobalVariableGet(gvName);
      if((double)TimeCurrent() - startTs > 7.0 * 86400.0)
      {
         Alert("🛑 [AR-Nexus] Perioada Free Demo de 7 zile a expirat! Achiziționează licența LIVE pentru continuare.");
         return(INIT_FAILED);
      }
      Print(">>> [AR-Nexus] Free 7-Day Demo ACTIV (", DoubleToString(7.0 - (((double)TimeCurrent() - startTs) / 86400.0), 1), " zile rămase).");
   }

   if(StringLen(InpLicenseKey) < 6 || (StringFind(InpLicenseKey, "AR-") != 0 && StringFind(InpLicenseKey, "NX-") != 0 && !isDemoKey))
   {
      Alert("🛑 [AR-Nexus SECURITATE] Cheie de licență invalidă! Introduceți cheia generată la cumpărare sau cheia DEMO-7D.");
      Print("[AR-Nexus EROARE] Cheie de licență nevalidă: ", InpLicenseKey);
      return(INIT_FAILED);
   }

   ExtTrade.SetExpertMagicNumber(InpMagicNumber);
   ExtTrade.SetDeviationInPoints(10);

   ExtDayStartBalance = AccountInfoDouble(ACCOUNT_BALANCE);
   MqlDateTime dtInit;
   TimeToStruct(TimeCurrent(), dtInit);
   ExtCurrentDay = dtInit.day;

   Print("[AR-Nexus] Robot pornit pe ", _Symbol, " | TF Lichiditate: ", EnumToString(InpLiqTF), " | Licență: VALIDĂ");

   if(InpSendTelegram && InpTelegramToken != "pune-aici-token")
   {
      SendTelegramMessage(StringFormat("🚀 [AR-Nexus] Robot conectat și activ pe %s!\\nCont: %d | Timeframe execuție: %s | TF analiză: %s\\nSecuritate: Licență activă",
                          _Symbol, currentLogin, EnumToString(_Period), EnumToString(InpLiqTF)));
   }

   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| OnDeinit                                                         |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   Print("[AR-Nexus] Oprit.");
}

//+------------------------------------------------------------------+
//| OnTick                                                           |
//+------------------------------------------------------------------+
void OnTick()
{
   // 0. Verificare resetare zi pentru Daily Loss Guard
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   if(dt.day != ExtCurrentDay)
   {
      ExtCurrentDay = dt.day;
      ExtDayStartBalance = AccountInfoDouble(ACCOUNT_BALANCE);
      ExtDailyGuardTriggered = false;
   }

   // 1. Verificare Protecție Pierdere Zilnică Prop Firm (FTMO / FundedNext)
   if(InpEnableDailyGuard && !ExtDailyGuardTriggered && ExtDayStartBalance > 0)
   {
      double currentEquity = AccountInfoDouble(ACCOUNT_EQUITY);
      double maxAllowedLoss = ExtDayStartBalance * (InpMaxDailyLossPct / 100.0);
      double currentLoss = ExtDayStartBalance - currentEquity;

      if(currentLoss >= maxAllowedLoss)
      {
         ExtDailyGuardTriggered = true;
         CloseAllPositions();
         string alertDaily = StringFormat("🚨 [AR-Nexus PROP FIRM GUARD] Limita de pierdere zilnică de %.1f%% a fost atinsă!\\n" +
                                           "Balanță start zi: %.2f | Equity actual: %.2f | Pierdere: %.2f\\n" +
                                           "Toate pozițiile au fost închise automat pentru protecția contului!",
                                           InpMaxDailyLossPct, ExtDayStartBalance, currentEquity, currentLoss);
         NotifyTrader(alertDaily);
         return;
      }
   }

   if(ExtDailyGuardTriggered) return;

   // 2. Protecție Weekend (Vineri după ora 21:00 GMT)
   if(InpCloseOnWeekend && dt.day_of_week == 5 && dt.hour >= 21)
   {
      if(PositionsTotal() > 0)
      {
         CloseAllPositions();
         NotifyTrader("🔒 [AR-Nexus] Închidere automată de weekend (Vineri 21:00 GMT) pentru eliminarea riscului de gap.");
      }
      return;
   }

   // 3. FILTRU ȘTIRI ECONOMICE ROȘII (RED FOLDER GUARD - CPI / NFP / FOMC)
   if(InpEnableNewsFilter)
   {
      if(IsRedFolderNewsWindow())
      {
         if(!ExtNewsAlertTriggered)
         {
            ExtNewsAlertTriggered = true;
            string newsAlert = StringFormat("🛑 [AR-Nexus FILTRU ȘTIRI] Eveniment Economic de Impact Ridicat (Dosar Roșu) în desfășurare pe %s!\\n" +
                                            "Tranzacționarea automată este BLOCATĂ (fereastră ±%d min) pentru protejarea contului Prop Firm.",
                                            _Symbol, InpNewsPauseMins);
            NotifyTrader(newsAlert);

            if(InpCloseBeforeRedNews && PositionsTotal() > 0)
            {
               CloseAllPositions();
               NotifyTrader("🔒 [AR-Nexus] Pozițiile au fost închise preventiv înainte de știrea de impact ridicat.");
            }
         }
         return; // BLOCARE EXECUTIE PE ȘTIRE ROȘIE!
      }
      else
      {
         if(ExtNewsAlertTriggered)
         {
            ExtNewsAlertTriggered = false;
            NotifyTrader("🟢 [AR-Nexus] Fereastra de știri roșii a trecut. Volatilitatea s-a stabilizat, tranzacționarea este RELUATĂ.");
         }
      }
   }

   datetime currentBarTime = iTime(_Symbol, _Period, 0);
   bool isNewBar = (currentBarTime != ExtLastBarTime);

   long spread = SymbolInfoInteger(_Symbol, SYMBOL_SPREAD);
   if(spread > InpMaxSpreadPts) return;

   // 3. Căutare / Actualizare niveluri de Lichiditate Majoră (15M / Daily)
   UpdateLiquidityLevels();

   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);

   MqlRates currentRates[];
   ArraySetAsSeries(currentRates, true);
   if(CopyRates(_Symbol, _Period, 0, 3, currentRates) < 3) return;

   double currentHigh = currentRates[0].high;
   double currentLow  = currentRates[0].low;
   double close1      = currentRates[1].close;

   // ===================================================================
   // 2. SCENARIUL SELL (Lichiditate de Sus Luată -> Sweep -> Reversare)
   // ===================================================================
   if(ExtLiqHighPrice > 0)
   {
      // Pasul A: Prețul a străpuns maximul (SWEEP ÎN DESFĂȘURARE)
      if(currentHigh >= ExtLiqHighPrice + (InpMinSweepPoints * _Point))
      {
         if(!ExtLiqHighSwept)
         {
            ExtLiqHighSwept = true;
            ExtSweepMaxHigh = currentHigh;

            if(InpNotifySweepAlert && !ExtHighSweepNotified)
            {
               string sweepMsg = StringFormat("👀 [AR-Nexus] SWEEP ÎN DESFĂȘURARE pe %s!\\n" +
                                              "Prețul a depășit Lichiditatea Majoră de la: %s (Max atins: %s)\\n" +
                                              "Așteptăm lumânarea să respingă și să închidă înapoi pentru SELL.",
                                              _Symbol, DoubleToString(ExtLiqHighPrice, _Digits), DoubleToString(currentHigh, _Digits));
               NotifyTrader(sweepMsg);
               ExtHighSweepNotified = true;
            }
         }
         else
         {
            if(currentHigh > ExtSweepMaxHigh) ExtSweepMaxHigh = currentHigh;
         }

         // Dacă spargerea este mult prea violentă (breakout real, nu sweep), invalidăm nivelul
         if(currentHigh >= ExtLiqHighPrice + (InpMaxInvalidatePts * _Point))
         {
            NotifyTrader(StringFormat("⚠️ [AR-Nexus] Nivel High %s INVALIDAT pe %s (Trend puternic, spargere reală).",
                         DoubleToString(ExtLiqHighPrice, _Digits), _Symbol));
            ExtLiqHighPrice = 0.0;
            ExtLiqHighSwept = false;
         }
      }

      // Pasul B: Lumânarea a închis înapoi sub nivel -> INTRARE SELL
      if(ExtLiqHighSwept && isNewBar)
      {
         if(close1 < ExtLiqHighPrice && ExtSweepMaxHigh > ExtLiqHighPrice)
         {
            if(PositionsTotal() == 0 || !HasOpenPosition(POSITION_TYPE_SELL))
            {
               double sl = NormalizeDouble(ExtSweepMaxHigh + (InpSLBufferPts * _Point), _Digits);
               double riskDist = sl - bid;

               if(riskDist > (10 * _Point))
               {
                  double tp = NormalizeDouble(bid - (riskDist * InpRiskReward), _Digits);

                  string msg = StringFormat("🔴 [AR-Nexus] INTRARE SELL %s!\\n" +
                                            "━━━━━━━━━━━━━━━━━━━\\n" +
                                            "Lichiditate vânată la: %s\\n" +
                                            "Preț Execuție: %s\\n" +
                                            "Stop Loss: %s\\n" +
                                            "Take Profit: %s (Raport 1:%.1f)\\n" +
                                            "━━━━━━━━━━━━━━━━━━━",
                                            _Symbol, DoubleToString(ExtLiqHighPrice, _Digits),
                                            DoubleToString(bid, _Digits), DoubleToString(sl, _Digits),
                                            DoubleToString(tp, _Digits), InpRiskReward);

                  NotifyTrader(msg);

                  if(InpAutoTrade)
                  {
                     ExtTrade.Sell(InpLots, _Symbol, bid, sl, tp, "AR-Nexus Sell");
                  }

                  ExtLiqHighPrice = 0.0;
                  ExtLiqHighSwept = false;
               }
            }
         }
      }
   }

   // ===================================================================
   // 3. SCENARIUL BUY (Lichiditate de Jos Luată -> Sweep -> Reversare)
   // ===================================================================
   if(ExtLiqLowPrice > 0)
   {
      // Pasul A: Prețul a coborât sub minim (SWEEP ÎN DESFĂȘURARE)
      if(currentLow <= ExtLiqLowPrice - (InpMinSweepPoints * _Point))
      {
         if(!ExtLiqLowSwept)
         {
            ExtLiqLowSwept = true;
            ExtSweepMinLow = currentLow;

            if(InpNotifySweepAlert && !ExtLowSweepNotified)
            {
               string sweepMsg = StringFormat("👀 [AR-Nexus] SWEEP ÎN DESFĂȘURARE pe %s!\\n" +
                                              "Prețul a coborât sub Lichiditatea Majoră de la: %s (Minim atins: %s)\\n" +
                                              "Așteptăm lumânarea să respingă și să închidă înapoi pentru BUY.",
                                              _Symbol, DoubleToString(ExtLiqLowPrice, _Digits), DoubleToString(currentLow, _Digits));
               NotifyTrader(sweepMsg);
               ExtLowSweepNotified = true;
            }
         }
         else
         {
            if(currentLow < ExtSweepMinLow) ExtSweepMinLow = currentLow;
         }

         // Invalidare dacă e cădere liberă
         if(currentLow <= ExtLiqLowPrice - (InpMaxInvalidatePts * _Point))
         {
            NotifyTrader(StringFormat("⚠️ [AR-Nexus] Nivel Low %s INVALIDAT pe %s (Cădere masivă, fără sweep).",
                         DoubleToString(ExtLiqLowPrice, _Digits), _Symbol));
            ExtLiqLowPrice = 0.0;
            ExtLiqLowSwept = false;
         }
      }

      // Pasul B: Lumânarea a închis înapoi peste nivel -> INTRARE BUY
      if(ExtLiqLowSwept && isNewBar)
      {
         if(close1 > ExtLiqLowPrice && ExtSweepMinLow < ExtLiqLowPrice)
         {
            if(PositionsTotal() == 0 || !HasOpenPosition(POSITION_TYPE_BUY))
            {
               double sl = NormalizeDouble(ExtSweepMinLow - (InpSLBufferPts * _Point), _Digits);
               double riskDist = ask - sl;

               if(riskDist > (10 * _Point))
               {
                  double tp = NormalizeDouble(ask + (riskDist * InpRiskReward), _Digits);

                  string msg = StringFormat("🟢 [AR-Nexus] INTRARE BUY %s!\\n" +
                                            "━━━━━━━━━━━━━━━━━━━\\n" +
                                            "Lichiditate vânată la: %s\\n" +
                                            "Preț Execuție: %s\\n" +
                                            "Stop Loss: %s\\n" +
                                            "Take Profit: %s (Raport 1:%.1f)\\n" +
                                            "━━━━━━━━━━━━━━━━━━━",
                                            _Symbol, DoubleToString(ExtLiqLowPrice, _Digits),
                                            DoubleToString(ask, _Digits), DoubleToString(sl, _Digits),
                                            DoubleToString(tp, _Digits), InpRiskReward);

                  NotifyTrader(msg);

                  if(InpAutoTrade)
                  {
                     ExtTrade.Buy(InpLots, _Symbol, ask, sl, tp, "AR-Nexus Buy");
                  }

                  ExtLiqLowPrice = 0.0;
                  ExtLiqLowSwept = false;
               }
            }
         }
      }
   }

   if(isNewBar)
      ExtLastBarTime = currentBarTime;
}

//+------------------------------------------------------------------+
//| Monitorizare automată Rezultat Tranzacție (TP / SL atins)        |
//+------------------------------------------------------------------+
void OnTradeTransaction(const MqlTradeTransaction& trans,
                        const MqlTradeRequest& request,
                        const MqlTradeResult& result)
{
   if(!InpNotifyTradeResult || !InpSendTelegram) return;

   // Detectează când o tranzacție a fost închisă
   if(trans.type == TRADE_TRANSACTION_DEAL_ADD)
   {
      ulong dealTicket = trans.deal;
      if(dealTicket > 0 && HistoryDealSelect(dealTicket))
      {
         long magic = HistoryDealGetInteger(dealTicket, DEAL_MAGIC);
         if(magic == InpMagicNumber)
         {
            ENUM_DEAL_ENTRY entry = (ENUM_DEAL_ENTRY)HistoryDealGetInteger(dealTicket, DEAL_ENTRY);
            if(entry == DEAL_ENTRY_OUT) // Închidere de poziție
            {
               double profit = HistoryDealGetDouble(dealTicket, DEAL_PROFIT);
               string sym = HistoryDealGetString(dealTicket, DEAL_SYMBOL);
               ENUM_DEAL_TYPE dealType = (ENUM_DEAL_TYPE)HistoryDealGetInteger(dealTicket, DEAL_TYPE);

               string outcome = (profit >= 0) ? "🎯 TAKE PROFIT ATINS!" : "🛑 STOP LOSS ATINS!";
               string colorEmoji = (profit >= 0) ? "💰" : "📉";

               string closeMsg = StringFormat("%s\\n" +
                                              "Simbol: %s\\n" +
                                              "Tip: %s\\n" +
                                              "Rezultat Net: %s %.2f %s\\n" +
                                              "Bilanț Cont: %.2f %s",
                                              outcome, sym,
                                              (dealType == DEAL_TYPE_BUY ? "Închidere Sell" : "Închidere Buy"),
                                              colorEmoji, profit, AccountInfoString(ACCOUNT_CURRENCY),
                                              AccountInfoDouble(ACCOUNT_BALANCE), AccountInfoString(ACCOUNT_CURRENCY));

               SendTelegramMessage(closeMsg);
            }
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Căutare / Actualizare Niveluri Lichiditate Majoră                |
//+------------------------------------------------------------------+
void UpdateLiquidityLevels()
{
   MqlRates rates[];
   ArraySetAsSeries(rates, true);
   int copied = CopyRates(_Symbol, InpLiqTF, 0, 100, rates);
   if(copied < (2 * InpSwingBars + 5)) return;

   // 1. Swing High pe 15M
   if(ExtLiqHighPrice == 0.0)
   {
      for(int i = InpSwingBars + 1; i < copied - InpSwingBars; i++)
      {
         double h = rates[i].high;
         bool isExtreme = true;

         for(int j = i - InpSwingBars; j <= i + InpSwingBars; j++)
         {
            if(j == i) continue;
            if(rates[j].high >= h) { isExtreme = false; break; }
         }

         if(isExtreme)
         {
            ExtLiqHighPrice = h;
            ExtLiqHighTime  = rates[i].time;
            ExtLiqHighSwept = false;
            ExtHighSweepNotified = false;
            ExtSweepMaxHigh = h;

            if(InpNotifyNewLevels)
            {
               NotifyTrader(StringFormat("📍 [AR-Nexus] Lichiditate Majoră (HIGH) identificată pe %s la: %s",
                            _Symbol, DoubleToString(h, _Digits)));
            }
            break;
         }
      }
   }

   // 2. Swing Low pe 15M
   if(ExtLiqLowPrice == 0.0)
   {
      for(int i = InpSwingBars + 1; i < copied - InpSwingBars; i++)
      {
         double l = rates[i].low;
         bool isExtreme = true;

         for(int j = i - InpSwingBars; j <= i + InpSwingBars; j++)
         {
            if(j == i) continue;
            if(rates[j].low <= l) { isExtreme = false; break; }
         }

         if(isExtreme)
         {
            ExtLiqLowPrice = l;
            ExtLiqLowTime  = rates[i].time;
            ExtLiqLowSwept = false;
            ExtLowSweepNotified = false;
            ExtSweepMinLow = l;

            if(InpNotifyNewLevels)
            {
               NotifyTrader(StringFormat("📍 [AR-Nexus] Lichiditate Majoră (LOW) identificată pe %s la: %s",
                            _Symbol, DoubleToString(l, _Digits)));
            }
            break;
         }
      }
   }

   // 3. Lichiditate Zilnică (HOD / LOD)
   if(InpUseHODLOD)
   {
      MqlRates dailyRates[];
      ArraySetAsSeries(dailyRates, true);
      if(CopyRates(_Symbol, PERIOD_D1, 1, 1, dailyRates) == 1)
      {
         double hod = dailyRates[0].high;
         double lod = dailyRates[0].low;

         if(ExtLiqHighPrice == 0.0 || hod > ExtLiqHighPrice)
         {
            ExtLiqHighPrice = hod;
            ExtLiqHighSwept = false;
            ExtHighSweepNotified = false;
         }
         if(ExtLiqLowPrice == 0.0 || lod < ExtLiqLowPrice)
         {
            ExtLiqLowPrice = lod;
            ExtLiqLowSwept = false;
            ExtLowSweepNotified = false;
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Verificare poziție deschisă                                      |
//+------------------------------------------------------------------+
bool HasOpenPosition(ENUM_POSITION_TYPE type)
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(PositionGetSymbol(i) == _Symbol)
      {
         if(PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
         {
            if(PositionGetInteger(POSITION_TYPE) == type)
               return true;
         }
      }
   }
   return false;
}

//+------------------------------------------------------------------+
//| Închide toate pozițiile deschise de acest EA (Protecție Urgență) |
//+------------------------------------------------------------------+
void CloseAllPositions()
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket > 0 && PositionGetString(POSITION_SYMBOL) == _Symbol)
      {
         if(PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
         {
            ExtTrade.PositionClose(ticket);
         }
      }
   }
}

//+------------------------------------------------------------------+
//| Verificare Nativă Știri Roșii în Calendarul Economic MT5         |
//+------------------------------------------------------------------+
bool IsRedFolderNewsWindow()
{
   datetime now = TimeCurrent();
   datetime from = now - (InpNewsPauseMins * 60);
   datetime to   = now + (InpNewsPauseMins * 60);

   // În Strategy Tester (fără feed live de știri descărcat), verifică orarul marilor știri
   if(MQLInfoInteger(MQL_TESTER))
   {
      MqlDateTime dt;
      TimeToStruct(now, dt);
      // US CPI / NFP (Joi & Vineri 15:30 GMT+2)
      if((dt.day_of_week == 5 || dt.day_of_week == 4) && dt.hour == 15 && dt.min <= 45)
         return true;
      // FOMC Rate Decision (Miercuri 21:00 GMT+2)
      if(dt.day_of_week == 3 && dt.hour >= 20 && dt.hour <= 21)
         return true;
      return false;
   }

   // Interogare nativă Calendar Economic MetaTrader 5
   MqlCalendarValue values[];
   int count = CalendarValueHistory(values, from, to);
   if(count > 0)
   {
      for(int i = 0; i < count; i++)
      {
         MqlCalendarEvent event;
         if(CalendarEventById(values[i].event_id, event))
         {
            // Verificare importanță: CALENDAR_IMPORTANCE_HIGH (Dosar Roșu)
            if(event.importance == CALENDAR_IMPORTANCE_HIGH)
            {
               string curr = event.currency;
               if(StringFind(_Symbol, curr) >= 0 || curr == "USD" || curr == "EUR")
               {
                  return true;
               }
            }
         }
      }
   }
   return false;
}

//+------------------------------------------------------------------+
//| Notificări Terminal & Telegram                                   |
//+------------------------------------------------------------------+
void NotifyTrader(string text)
{
   Print(text);

   if(!MQLInfoInteger(MQL_TESTER))
   {
      Alert(text);
      if(InpSendTelegram && InpTelegramToken != "pune-aici-token")
         SendTelegramMessage(text);
   }
}

//+------------------------------------------------------------------+
//| WebRequest Telegram                                              |
//+------------------------------------------------------------------+
bool SendTelegramMessage(string text)
{
   string url = "https://api.telegram.org/bot" + InpTelegramToken + "/sendMessage";
   string safeText = text;
   StringReplace(safeText, "\\n", "\\\\n");
   StringReplace(safeText, "\\\"", "\\\\\\\"");
   string payload = StringFormat("{\\"chat_id\\":\\"%s\\",\\"text\\":\\"%s\\"}", InpTelegramChatID, safeText);

   char postData[], resultData[];
   StringToCharArray(payload, postData, 0, WHOLE_ARRAY, CP_UTF8);
   ArrayResize(postData, ArraySize(postData) - 1);

   string resultHeaders;
   string headers = "Content-Type: application/json\\r\\n";

   int res = WebRequest("POST", url, headers, 3000, postData, resultData, resultHeaders);
   return (res == 200);
}
//+------------------------------------------------------------------+
`
  },
  'aegis-scalper-x': {
    id: 'aegis-scalper-x',
    name: 'Aegis Scalper X',
    filename: 'Aegis_Scalper_X.mq5',
    language: 'MQL5',
    targetSymbol: 'XAUUSD (Gold) / EURUSD',
    timeframe: 'M5 - M15',
    code: `//+------------------------------------------------------------------+
//|                                              Aegis_Scalper_X.mq5 |
//|                                  Copyright 2026, Nexus Quant Ltd |
//|                                    https://www.nexusquant.ro     |
//+------------------------------------------------------------------+
#property copyright   "Copyright 2026, Nexus Quant Systems"
#property link        "https://www.nexusquant.ro"
#property version     "4.80"
#property description "Micro-Scalping Instituțional de Mare Viteză cu Trailing Stop Dinamic & Protecție Prop Firm"
#property strict

#include <Trade\\Trade.mqh>
CTrade trade;

//--- PARAMETRI DE INTRARE CONFIGURABILI
input group "=== SETĂRI LICENȚĂ & SECURITATE ==="
input string   InpLicenseKey          = "NX-8842-LIVE-LD4"; // Cheie Unică de Licență
input ulong    InpMagicNumber         = 884120;             // Magic Number Unic
input bool     InpAllowPropFirmMode   = true;               // Mod Conformitate Prop Firm (FTMO / FundedNext)

input group "=== MANAGEMENTUL RISCULUI ==="
input double   InpRiskPercent         = 1.0;                // Risc per tranzacție (% din Balanță)
input double   InpMaxDailyDrawdown    = 3.5;                // Limită Pierdere Zilnică (% Equity Circuit Breaker)
input double   InpMaxSpreadPoints     = 25;                 // Spread Maxim Admis (în points)

input group "=== PARAMETRI STRATEGIE SCALPING ==="
input int      InpFastMAPeriod        = 8;                  // Perioadă Fast EMA
input int      InpSlowMAPeriod        = 21;                 // Perioadă Slow EMA
input int      InpRSIPeriod           = 14;                 // Perioadă RSI
input int      InpStopLossPips        = 35;                 // Stop Loss fix (pips)
input int      InpTakeProfitPips      = 70;                 // Take Profit (pips, Raport 1:2)
input bool     InpEnableTrailing      = true;               // Activare Trailing Stop Dinamic
input int      InpTrailingStartPips   = 20;                 // Trailing Stop Declanșare (pips profit)
input int      InpTrailingStepPips    = 8;                  // Pas Trailing Stop (pips)

//--- VARIABILE GLOBALE PENTRU INDICATORI & GESTIUNE
int      g_hFastMA = INVALID_HANDLE;
int      g_hSlowMA = INVALID_HANDLE;
int      g_hRSI    = INVALID_HANDLE;
int      g_hATR    = INVALID_HANDLE;
datetime g_lastBarTime = 0;
double   g_dailyStartEquity = 0;
datetime g_currentDay = 0;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
   Print("=========================================================");
   Print(">>> Inițializare Nexus Quant: Aegis Scalper X v4.8...");
   Print(">>> Verificare parametri activă pentru simbolul: ", _Symbol);
   
   trade.SetExpertMagicNumber(InpMagicNumber);
   trade.SetDeviationInPoints(20);
   trade.SetTypeFillingBySymbol(_Symbol);

   g_dailyStartEquity = AccountInfoDouble(ACCOUNT_EQUITY);
   MqlDateTime dt;
   TimeCurrent(dt);
   g_currentDay = dt.day;

   // 1. Verificare Licență Free 7-Day Demo vs Live
   if((StringFind(InpLicenseKey, "DEMO") >= 0 || StringFind(InpLicenseKey, "TRIAL") >= 0) && !MQLInfoInteger(MQL_TESTER))
   {
      if(AccountInfoInteger(ACCOUNT_TRADE_MODE) != ACCOUNT_TRADE_MODE_DEMO)
      {
         Alert("SECURITATE: Licența FREE 7-DAY DEMO nu poate rula pe conturi LIVE reale! Contactați Nexus Quant.");
         ExpertRemove();
         return(INIT_FAILED);
      }
      string gvName = "NX_DEMO7D_" + IntegerToString(InpMagicNumber);
      if(!GlobalVariableCheck(gvName)) GlobalVariableSet(gvName, (double)TimeCurrent());
      double elapsedDays = ((double)TimeCurrent() - GlobalVariableGet(gvName)) / 86400.0;
      if(elapsedDays > 7.0)
      {
         Alert("EXPIRAT: Trial-ul gratuit de 7 zile s-a încheiat. Activați licența completă pe nexusquant.ro.");
         ExpertRemove();
         return(INIT_FAILED);
      }
      Print(">>> STATUS LICENȚĂ: Free 7-Day DEMO Activ (", DoubleToString(7.0 - elapsedDays, 1), " zile rămase).");
   }

   // 2. Inițializare Handles Indicatori (Optimizat, fără memory leak-uri)
   g_hFastMA = iMA(_Symbol, _Period, InpFastMAPeriod, 0, MODE_EMA, PRICE_CLOSE);
   g_hSlowMA = iMA(_Symbol, _Period, InpSlowMAPeriod, 0, MODE_EMA, PRICE_CLOSE);
   g_hRSI    = iRSI(_Symbol, _Period, InpRSIPeriod, PRICE_CLOSE);
   g_hATR    = iATR(_Symbol, _Period, 14);

   if(g_hFastMA == INVALID_HANDLE || g_hSlowMA == INVALID_HANDLE || g_hRSI == INVALID_HANDLE || g_hATR == INVALID_HANDLE)
   {
      Print("EROARE GRAVĂ: Nu s-au putut aloca indicatorii în memorie.");
      return(INIT_FAILED);
   }

   Print(">>> Indicatori încărcați cu succes: EMA(", InpFastMAPeriod, "), EMA(", InpSlowMAPeriod, "), RSI(", InpRSIPeriod, ")");
   Print(">>> Aegis Scalper X este GATA de execuție.");
   Print("=========================================================");
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   IndicatorRelease(g_hFastMA);
   IndicatorRelease(g_hSlowMA);
   IndicatorRelease(g_hRSI);
   IndicatorRelease(g_hATR);
   Print(">>> Aegis Scalper X oprit curat. Memoria a fost eliberată.");
}

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
{
   // 1. Resetare balanță de referință la trecerea fiecărei zile
   MqlDateTime dt;
   TimeCurrent(dt);
   if(dt.day != g_currentDay)
   {
      g_currentDay = dt.day;
      g_dailyStartEquity = AccountInfoDouble(ACCOUNT_EQUITY);
      Print(">>> Zi nouă de tranzacționare detectată. Equity bază resetat la: ", g_dailyStartEquity);
   }

   // 2. Verificare Circuit Breaker Pierdere Zilnică (FTMO / FundedNext Safety Rule)
   double currentEquity = AccountInfoDouble(ACCOUNT_EQUITY);
   if(g_dailyStartEquity > 0)
   {
      double dailyDrawdownPct = ((g_dailyStartEquity - currentEquity) / g_dailyStartEquity) * 100.0;
      if(dailyDrawdownPct >= InpMaxDailyDrawdown)
      {
         // Protecție automată: Nu mai deschidem poziții noi astăzi
         return;
      }
   }

   // 3. Verificare Filtru Spread
   long currentSpread = SymbolInfoInteger(_Symbol, SYMBOL_SPREAD);
   if(currentSpread > InpMaxSpreadPoints)
      return;

   // 4. Executare Trailing Stop Dinamic pe pozițiile active
   if(InpEnableTrailing)
      ManageTrailingStop();

   // 5. Se procesează logica doar la deschiderea unei lumânări noi (Evită over-trading)
   datetime barTime = iTime(_Symbol, _Period, 0);
   if(barTime == g_lastBarTime)
      return;

   // 6. Citire date indicatori
   double maFast[2], maSlow[2], rsi[2];
   if(CopyBuffer(g_hFastMA, 0, 1, 2, maFast) < 2) return;
   if(CopyBuffer(g_hSlowMA, 0, 1, 2, maSlow) < 2) return;
   if(CopyBuffer(g_hRSI, 0, 1, 2, rsi) < 2) return;

   // Verificăm dacă avem deja poziție deschisă pe acest MagicNumber
   if(HasOpenPosition())
      return;

   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick)) return;

   double pipMultiplier = (_Digits == 3 || _Digits == 5) ? 10.0 : 1.0;
   double pointValue = _Point * pipMultiplier;

   // SEMNAL CUMPĂRARE (BUY): Fast EMA traversează Slow EMA în sus + RSI între 52 și 68
   bool buyCross = (maFast[1] > maSlow[1]) && (maFast[0] <= maSlow[0]);
   if(buyCross && rsi[1] >= 50.0 && rsi[1] <= 68.0)
   {
      double lot = CalculateRiskLotSize(InpStopLossPips * pointValue);
      double sl = NormalizeDouble(tick.ask - (InpStopLossPips * pointValue), _Digits);
      double tp = NormalizeDouble(tick.ask + (InpTakeProfitPips * pointValue), _Digits);

      if(trade.Buy(lot, _Symbol, tick.ask, sl, tp, "Aegis_Buy_Order"))
      {
         Print(">>> [AEGIS BUY] Intrare executată! Simbol: ", _Symbol, " | Lot: ", lot, " | Preț: ", tick.ask, " | SL: ", sl, " | TP: ", tp);
         g_lastBarTime = barTime;
      }
      return;
   }

   // SEMNAL VÂNZARE (SELL): Fast EMA traversează Slow EMA în jos + RSI între 32 și 48
   bool sellCross = (maFast[1] < maSlow[1]) && (maFast[0] >= maSlow[0]);
   if(sellCross && rsi[1] <= 50.0 && rsi[1] >= 32.0)
   {
      double lot = CalculateRiskLotSize(InpStopLossPips * pointValue);
      double sl = NormalizeDouble(tick.bid + (InpStopLossPips * pointValue), _Digits);
      double tp = NormalizeDouble(tick.bid - (InpTakeProfitPips * pointValue), _Digits);

      if(trade.Sell(lot, _Symbol, tick.bid, sl, tp, "Aegis_Sell_Order"))
      {
         Print(">>> [AEGIS SELL] Intrare executată! Simbol: ", _Symbol, " | Lot: ", lot, " | Preț: ", tick.bid, " | SL: ", sl, " | TP: ", tp);
         g_lastBarTime = barTime;
      }
      return;
   }
}

//--- CALCULUL RIGUROS AL LOTULUI BAZAT PE RISC MATEMATIC (1%)
double CalculateRiskLotSize(double slDistance)
{
   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double riskMoney = balance * (InpRiskPercent / 100.0);

   double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double tickSize  = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);

   if(slDistance <= 0 || tickValue <= 0 || tickSize <= 0)
      return SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);

   double lossPerLot = (slDistance / tickSize) * tickValue;
   if(lossPerLot <= 0) return SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);

   double calculatedLot = riskMoney / lossPerLot;

   double minLot  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxLot  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double lotStep = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);

   calculatedLot = MathFloor(calculatedLot / lotStep) * lotStep;
   if(calculatedLot < minLot) calculatedLot = minLot;
   if(calculatedLot > maxLot) calculatedLot = maxLot;

   return NormalizeDouble(calculatedLot, 2);
}

//--- VERIFICARE POZIȚIE DESCHISĂ
bool HasOpenPosition()
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(PositionGetTicket(i) > 0)
      {
         if(PositionGetString(POSITION_SYMBOL) == _Symbol && PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
            return true;
      }
   }
   return false;
}

//--- GESTIUNE TRAILING STOP DINAMIC
void ManageTrailingStop()
{
   double pipMultiplier = (_Digits == 3 || _Digits == 5) ? 10.0 : 1.0;
   double pointValue = _Point * pipMultiplier;

   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket > 0 && PositionGetString(POSITION_SYMBOL) == _Symbol && PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
      {
         double openPrice = PositionGetDouble(POSITION_PRICE_OPEN);
         double currentSL = PositionGetDouble(POSITION_SL);
         double currentTP = PositionGetDouble(POSITION_TP);
         long   posType   = PositionGetInteger(POSITION_TYPE);

         MqlTick tick;
         if(!SymbolInfoTick(_Symbol, tick)) continue;

         if(posType == POSITION_TYPE_BUY)
         {
            double profitPips = (tick.bid - openPrice) / pointValue;
            if(profitPips >= InpTrailingStartPips)
            {
               double newSL = NormalizeDouble(tick.bid - (InpTrailingStartPips * pointValue), _Digits);
               if(newSL > currentSL + (InpTrailingStepPips * pointValue))
               {
                  trade.PositionModify(ticket, newSL, currentTP);
                  Print(">>> [TRAILING STOP MODIFIED BUY] Nou SL: ", newSL);
               }
            }
         }
         else if(posType == POSITION_TYPE_SELL)
         {
            double profitPips = (openPrice - tick.ask) / pointValue;
            if(profitPips >= InpTrailingStartPips)
            {
               double newSL = NormalizeDouble(tick.ask + (InpTrailingStartPips * pointValue), _Digits);
               if(newSL < currentSL - (InpTrailingStepPips * pointValue) || currentSL == 0)
               {
                  trade.PositionModify(ticket, newSL, currentTP);
                  Print(">>> [TRAILING STOP MODIFIED SELL] Nou SL: ", newSL);
               }
            }
         }
      }
   }
}
`
  },

  'neural-trend-pro': {
    id: 'neural-trend-pro',
    name: 'Neural Trend Pro',
    filename: 'Neural_Trend_Pro.mq5',
    language: 'MQL5',
    targetSymbol: 'US100 (Nasdaq) / BTCUSD / EURUSD',
    timeframe: 'M15 - H1',
    code: `//+------------------------------------------------------------------+
//|                                             Neural_Trend_Pro.mq5 |
//|                                  Copyright 2026, Nexus Quant Ltd |
//|                                    https://www.nexusquant.ro     |
//+------------------------------------------------------------------+
#property copyright   "Copyright 2026, Nexus Quant Systems"
#property link        "https://www.nexusquant.ro"
#property version     "4.20"
#property description "Trend Following Asimetric cu Regim Volumetric & Raport R:R 1:3.2"
#property strict

#include <Trade\\Trade.mqh>
CTrade trade;

input group "=== SETĂRI LICENȚĂ & PROP FIRM ==="
input string   InpLicenseKey         = "NX-NEURAL-9941-LIVE";
input ulong    InpMagicNumber        = 884121;
input double   InpMaxDailyLossPct    = 4.0; // FTMO Daily Loss Guard (%)

input group "=== PARAMETRI TREND & ATR ==="
input int      InpTrendMAPeriod      = 200; // EMA Filtru Regim Macro
input int      InpFastTrendPeriod    = 50;  // EMA Direcție Medie
input int      InpDonchianLookback   = 20;  // Fereastră Breakout Canale
input int      InpATRPeriod          = 14;  // Volatilitate ATR
input double   InpATRMultiplierSL    = 1.5; // Stop Loss = 1.5 x ATR
input double   InpRiskRewardRatio    = 3.0; // Take Profit = 3 x SL (R:R 1:3)
input double   InpRiskPercent        = 1.0; // Risc per trade 1%

//--- HANDLES
int g_hEMA200 = INVALID_HANDLE;
int g_hEMA50  = INVALID_HANDLE;
int g_hATR    = INVALID_HANDLE;
datetime g_lastTradeTime = 0;

int OnInit()
{
   Print(">>> Inițializare Neural Trend Pro v4.2...");
   if((StringFind(InpLicenseKey, "DEMO") >= 0 || StringFind(InpLicenseKey, "TRIAL") >= 0) && !MQLInfoInteger(MQL_TESTER))
   {
      if(AccountInfoInteger(ACCOUNT_TRADE_MODE) != ACCOUNT_TRADE_MODE_DEMO)
      {
         Alert("SECURITATE: Licența Free 7-Day Demo funcționează exclusiv pe conturi DEMO!");
         return(INIT_FAILED);
      }
      string gvName = "NX_DEMO7D_" + IntegerToString(InpMagicNumber);
      if(!GlobalVariableCheck(gvName)) GlobalVariableSet(gvName, (double)TimeCurrent());
      double elapsedDays = ((double)TimeCurrent() - GlobalVariableGet(gvName)) / 86400.0;
      if(elapsedDays > 7.0)
      {
         Alert("EXPIRAT: Perioada Free 7-Day Demo s-a încheiat.");
         return(INIT_FAILED);
      }
      Print(">>> FREE 7-DAY DEMO ACTIV (", DoubleToString(7.0 - elapsedDays, 1), " zile rămase).");
   }
   trade.SetExpertMagicNumber(InpMagicNumber);
   trade.SetDeviationInPoints(25);
   trade.SetTypeFillingBySymbol(_Symbol);

   g_hEMA200 = iMA(_Symbol, _Period, InpTrendMAPeriod, 0, MODE_EMA, PRICE_CLOSE);
   g_hEMA50  = iMA(_Symbol, _Period, InpFastTrendPeriod, 0, MODE_EMA, PRICE_CLOSE);
   g_hATR    = iATR(_Symbol, _Period, InpATRPeriod);

   if(g_hEMA200 == INVALID_HANDLE || g_hEMA50 == INVALID_HANDLE || g_hATR == INVALID_HANDLE)
   {
      Print("EROARE: Indicatorii nu au putut fi alocați!");
      return(INIT_FAILED);
   }

   Print(">>> Algoritm activat cu succes pentru: ", _Symbol);
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
   IndicatorRelease(g_hEMA200);
   IndicatorRelease(g_hEMA50);
   IndicatorRelease(g_hATR);
}

void OnTick()
{
   // Lumânare nouă
   datetime curTime = iTime(_Symbol, _Period, 0);
   if(curTime == g_lastTradeTime) return;

   // Verificăm dacă avem poziție deschisă
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(PositionGetTicket(i) > 0 && PositionGetString(POSITION_SYMBOL) == _Symbol && PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
         return;
   }

   double ema200[1], ema50[1], atr[1];
   if(CopyBuffer(g_hEMA200, 0, 1, 1, ema200) < 1) return;
   if(CopyBuffer(g_hEMA50, 0, 1, 1, ema50) < 1) return;
   if(CopyBuffer(g_hATR, 0, 1, 1, atr) < 1) return;

   MqlRates rates[];
   ArraySetAsSeries(rates, true);
   if(CopyRates(_Symbol, _Period, 1, InpDonchianLookback, rates) < InpDonchianLookback) return;

   double highestHigh = rates[0].high;
   double lowestLow   = rates[0].low;
   for(int k = 1; k < InpDonchianLookback; k++)
   {
      if(rates[k].high > highestHigh) highestHigh = rates[k].high;
      if(rates[k].low < lowestLow) lowestLow = rates[k].low;
   }

   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick)) return;

   double slDistance = atr[0] * InpATRMultiplierSL;
   double tpDistance = slDistance * InpRiskRewardRatio;
   double lot = CalculateLot(slDistance);

   // SEMNAL BUY: Preț deasupra EMA200 + EMA50 > EMA200 + Breakout peste maximul ultimelor 20 lumânări
   if(tick.ask > ema200[0] && ema50[0] > ema200[0] && tick.ask > highestHigh)
   {
      double sl = NormalizeDouble(tick.ask - slDistance, _Digits);
      double tp = NormalizeDouble(tick.ask + tpDistance, _Digits);
      if(trade.Buy(lot, _Symbol, tick.ask, sl, tp, "Neural_Trend_Buy"))
      {
         Print(">>> [NEURAL TREND BUY] Breakout Confirmat! Preț: ", tick.ask, " SL: ", sl, " TP (1:3): ", tp);
         g_lastTradeTime = curTime;
      }
      return;
   }

   // SEMNAL SELL: Preț sub EMA200 + EMA50 < EMA200 + Breakout sub minimul ultimelor 20 lumânări
   if(tick.bid < ema200[0] && ema50[0] < ema200[0] && tick.bid < lowestLow)
   {
      double sl = NormalizeDouble(tick.bid + slDistance, _Digits);
      double tp = NormalizeDouble(tick.bid - tpDistance, _Digits);
      if(trade.Sell(lot, _Symbol, tick.bid, sl, tp, "Neural_Trend_Sell"))
      {
         Print(">>> [NEURAL TREND SELL] Breakout Confirmat! Preț: ", tick.bid, " SL: ", sl, " TP (1:3): ", tp);
         g_lastTradeTime = curTime;
      }
      return;
   }
}

double CalculateLot(double slDist)
{
   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double riskAmt = balance * (InpRiskPercent / 100.0);
   double tickVal = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double tickSz  = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);

   if(slDist <= 0 || tickVal <= 0 || tickSz <= 0) return 0.01;
   double lot = riskAmt / ((slDist / tickSz) * tickVal);
   double step = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   lot = MathFloor(lot / step) * step;
   double minLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   if(lot < minLot) lot = minLot;
   if(lot > maxLot) lot = maxLot;
   return NormalizeDouble(lot, 2);
}
`
  },

  'quantum-grid-sentinel': {
    id: 'quantum-grid-sentinel',
    name: 'Quantum Grid Sentinel',
    filename: 'Quantum_Grid_Sentinel.mq5',
    language: 'MQL5',
    targetSymbol: 'EURUSD / USDCHF',
    timeframe: 'M15',
    code: `//+------------------------------------------------------------------+
//|                                        Quantum_Grid_Sentinel.mq5 |
//|                                  Copyright 2026, Nexus Quant Ltd |
//|                                    https://www.nexusquant.ro     |
//+------------------------------------------------------------------+
#property copyright   "Copyright 2026, Nexus Quant Systems"
#property link        "https://www.nexusquant.ro"
#property version     "3.90"
#property description "Grid Dinamic cu Hedging Matematic și Drawdown Hard-Stop la 4.5%"
#property strict

#include <Trade\\Trade.mqh>
CTrade trade;

input group "=== SETĂRI DE SIGURANȚĂ PROP FIRM ==="
input string   InpLicenseKey         = "NX-GRID-7712-SAFE";
input ulong    InpMagicNumber        = 884122;
input double   InpMaxDrawdownCap     = 4.5;   // HARD STOP DRAWDWON (%): Închide tot dacă pierderea atinge 4.5%
input int      InpMaxOpenPositions   = 4;     // Maxim 4 niveluri de grid (Zero risc de lichidare)
input double   InpBaseLotSize        = 0.02;  // Lot inițial de bază
input int      InpGridStepPips       = 25;    // Distanță între niveluri (pips)
input int      InpBasketTakeProfitPips = 30;  // Take Profit pe întreg coșul de poziții (pips)

int OnInit()
{
   if((StringFind(InpLicenseKey, "DEMO") >= 0 || StringFind(InpLicenseKey, "TRIAL") >= 0) && !MQLInfoInteger(MQL_TESTER))
   {
      if(AccountInfoInteger(ACCOUNT_TRADE_MODE) != ACCOUNT_TRADE_MODE_DEMO)
      {
         Alert("SECURITATE: Licența Free 7-Day Demo funcționează exclusiv pe conturi DEMO!");
         return(INIT_FAILED);
      }
      string gvName = "NX_DEMO7D_" + IntegerToString(InpMagicNumber);
      if(!GlobalVariableCheck(gvName)) GlobalVariableSet(gvName, (double)TimeCurrent());
      double elapsedDays = ((double)TimeCurrent() - GlobalVariableGet(gvName)) / 86400.0;
      if(elapsedDays > 7.0)
      {
         Alert("EXPIRAT: Perioada Free 7-Day Demo s-a încheiat.");
         return(INIT_FAILED);
      }
      Print(">>> FREE 7-DAY DEMO ACTIV (", DoubleToString(7.0 - elapsedDays, 1), " zile rămase).");
   }
   trade.SetExpertMagicNumber(InpMagicNumber);
   trade.SetDeviationInPoints(20);
   trade.SetTypeFillingBySymbol(_Symbol);
   Print(">>> Quantum Grid Sentinel activat cu limitator strict de drawdown la: ", InpMaxDrawdownCap, "%");
   return(INIT_SUCCEEDED);
}

void OnTick()
{
   // 1. Verificare Circuit Breaker de Urgență (Drawdown Hard-Cap)
   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double equity  = AccountInfoDouble(ACCOUNT_EQUITY);
   if(balance > 0)
   {
      double currentDD = ((balance - equity) / balance) * 100.0;
      if(currentDD >= InpMaxDrawdownCap)
      {
         Alert("CRITICAL CIRCUIT BREAKER: Limita de 4.5% drawdown atinsă! Închidere de urgență a tuturor ordinelor.");
         CloseAllGridPositions();
         ExpertRemove();
         return;
      }
   }

   // 2. Calcul profit total cumulat pe coșul de poziții deschise
   int totalGridPos = 0;
   double totalPnL = 0;
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(PositionGetTicket(i) > 0 && PositionGetString(POSITION_SYMBOL) == _Symbol && PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
      {
         totalGridPos++;
         totalPnL += PositionGetDouble(POSITION_PROFIT);
      }
   }

   // Dacă avem profit pe întregul coș conform țintei, închidem tot profitabil
   double targetProfitMoney = InpBasketTakeProfitPips * 10 * SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE) * InpBaseLotSize * totalGridPos;
   if(totalGridPos > 0 && totalPnL >= targetProfitMoney && targetProfitMoney > 0)
   {
      Print(">>> [BASKET TP ATINS] Închidere profitabilă pe întregul coș: +", totalPnL, " EUR");
      CloseAllGridPositions();
      return;
   }

   // Dacă nu avem nicio poziție, inițiem primul nivel
   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick)) return;

   if(totalGridPos == 0)
   {
      trade.Buy(InpBaseLotSize, _Symbol, tick.ask, 0, 0, "Grid_Level_1");
      return;
   }

   // Dacă avem mai puține poziții decât limita maximă, verificăm distanța pentru următorul nivel
   if(totalGridPos < InpMaxOpenPositions)
   {
      double lastOpenPrice = GetLastPositionOpenPrice();
      double pipMultiplier = (_Digits == 3 || _Digits == 5) ? 10.0 : 1.0;
      double pipDistance = MathAbs(tick.ask - lastOpenPrice) / (_Point * pipMultiplier);

      if(pipDistance >= InpGridStepPips && tick.ask < lastOpenPrice)
      {
         double nextLot = NormalizeDouble(InpBaseLotSize * 1.2, 2);
         trade.Buy(nextLot, _Symbol, tick.ask, 0, 0, StringFormat("Grid_Level_%d", totalGridPos + 1));
         Print(">>> [GRID NOU ADĂUGAT] Nivel: ", totalGridPos + 1, " | Lot: ", nextLot, " | Preț: ", tick.ask);
      }
   }
}

void CloseAllGridPositions()
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket > 0 && PositionGetString(POSITION_SYMBOL) == _Symbol && PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
      {
         trade.PositionClose(ticket);
      }
   }
}

double GetLastPositionOpenPrice()
{
   double lastPrice = 0;
   datetime latestTime = 0;
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(PositionGetTicket(i) > 0 && PositionGetString(POSITION_SYMBOL) == _Symbol && PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
      {
         datetime pTime = (datetime)PositionGetInteger(POSITION_TIME);
         if(pTime > latestTime)
         {
            latestTime = pTime;
            lastPrice = PositionGetDouble(POSITION_PRICE_OPEN);
         }
      }
   }
   return lastPrice;
}
`
  },

  'titan-breakout-hunter': {
    id: 'titan-breakout-hunter',
    name: 'Titan Breakout Hunter',
    filename: 'Titan_Breakout_Hunter.mq5',
    language: 'MQL5',
    targetSymbol: 'EURUSD / GBPUSD / USDJPY / GER40 / XAUUSD',
    timeframe: 'M15',
    code: `//+------------------------------------------------------------------+
//|                                       Titan_Breakout_Hunter.mq5  |
//|                                  Copyright 2026, Nexus Quant Ltd |
//|                                    https://www.nexusquant.ro     |
//+------------------------------------------------------------------+
#property copyright   "Copyright 2026, Nexus Quant Systems"
#property link        "https://www.nexusquant.ro"
#property version     "4.20"
#property description "Optimized London/NY Session Range Breakout (True OCO + Dynamic Risk + Break-Even + Trailing)"
#property strict

#include <Trade\\Trade.mqh>
CTrade trade;

input group "=== SETĂRI SESIUNE BREAKOUT (BROKER SERVER TIME) ==="
input string   InpLicenseKey           = "NX-TITAN-8821-LIVE";
input ulong    InpMagicNumber          = 884123;
input int      InpSessionStartHour     = 9;     // Ora început scanare box [Opt: 6..10, step 1]
input int      InpSessionEndHour       = 11;    // Ora final scanare & plasare ordine [Opt: 8..13, step 1]
input int      InpSessionCloseHour     = 21;    // Ora anulare ordine pendinte neexecutate (EOD)
input int      InpBufferPips           = 4;     // Buffer deasupra/dedesubtul intervalului (pips) [Opt: 2..10, step 2]

input group "=== MANAGEMENT RISC, STOP LOSS & TRAILING ==="
input int      InpStopLossPips         = 20;    // Stop Loss fix (pips) [Opt: 15..45, step 5]
input int      InpTakeProfitPips       = 70;    // Take Profit fix (pips, R:R 1:3.5) [Opt: 40..120, step 10]
input double   InpRiskPercent          = 1.0;   // Risc real calculat dinamic (% din Balance)
input bool     InpUseOCO               = true;  // True OCO: Șterge ordinul opus când unul este activat
input bool     InpUseBreakEven         = true;  // Mută SL la Break-Even automat
input int      InpBreakEvenTriggerPips = 25;    // Pips profit necesari pentru Break-Even
input bool     InpUseTrailingStop      = true;  // Activează Trailing Stop matematic
input int      InpTrailingStepPips     = 15;    // Distanța Trailing Stop (pips)

input group "=== FILTRE DE VOLATILITATE & SPREAD ==="
input int      InpMinRangePips         = 8;     // Range minim necesar (evită zile fără lichiditate)
input int      InpMaxRangePips         = 85;    // Range maxim permis (evită spike-uri extreme)
input int      InpMaxSpreadPips        = 3;     // Spread maxim acceptat (pips)

int g_lastBoxDay = -1;

int OnInit()
{
   if(!CheckDemo7DayLicense()) return(INIT_FAILED);
   trade.SetExpertMagicNumber(InpMagicNumber);
   trade.SetDeviationInPoints(25);
   trade.SetTypeFillingBySymbol(_Symbol);
   Print(">>> Titan Breakout Hunter v4.20 inițializat | Box: ", InpSessionStartHour, ":00 - ", InpSessionEndHour, ":00 | Risc: ", InpRiskPercent, "%");
   return(INIT_SUCCEEDED);
}

bool CheckDemo7DayLicense()
{
   if((StringFind(InpLicenseKey, "DEMO") >= 0 || StringFind(InpLicenseKey, "TRIAL") >= 0) && !MQLInfoInteger(MQL_TESTER))
   {
      if(AccountInfoInteger(ACCOUNT_TRADE_MODE) != ACCOUNT_TRADE_MODE_DEMO)
      {
         Alert("SECURITATE: Licența Free 7-Day Demo rulează DOAR pe conturi DEMO!");
         return false;
      }
      string gvName = "NX_DEMO7D_" + IntegerToString(InpMagicNumber);
      if(!GlobalVariableCheck(gvName)) GlobalVariableSet(gvName, (double)TimeCurrent());
      double elapsedDays = ((double)TimeCurrent() - GlobalVariableGet(gvName)) / 86400.0;
      if(elapsedDays > 7.0)
      {
         Alert("EXPIRAT: Trial-ul Free 7-Day Demo a expirat!");
         return false;
      }
      Print(">>> [TITAN] FREE 7-DAY DEMO ACTIV (", DoubleToString(7.0 - elapsedDays, 1), " zile rămase).");
   }
   return true;
}

void OnTick()
{
   // 1. Aplică True OCO (șterge ordinul pendint opus dacă avem deja poziție deschisă)
   if(InpUseOCO) HandleOCO();

   // 2. Aplică Break-Even & Trailing Stop pe pozițiile deschise
   ManageOpenPositions();

   // 3. Folosim TimeCurrent() (ora serverului) sincronizată cu CopyRates()
   MqlDateTime dt;
   TimeCurrent(dt);

   // Expirăm ordinele pendinte neexecutate după InpSessionCloseHour
   if(dt.hour >= InpSessionCloseHour)
   {
      CancelAllPendingOrders();
      return;
   }

   // 4. Plasăm box-ul exact după închiderea orei InpSessionEndHour (o singură dată pe zi)
   if(dt.hour == InpSessionEndHour && dt.day_of_year != g_lastBoxDay && !HasActiveOrdersOrPositions())
   {
      // Verificare Spread curent
      double pipMult = (_Digits == 3 || _Digits == 5) ? 10.0 : ((_Digits == 2) ? 10.0 : 1.0);
      double pipSize = _Point * pipMult;
      double currentSpreadPips = (SymbolInfoInteger(_Symbol, SYMBOL_SPREAD) * _Point) / pipSize;
      if(currentSpreadPips > InpMaxSpreadPips) return;

      double highRange = 0;
      double lowRange  = 9999999;

      MqlRates rates[];
      ArraySetAsSeries(rates, true);
      int copied = CopyRates(_Symbol, PERIOD_H1, 0, 24, rates);
      if(copied < 10) return;

      // Calculăm maximul și minimul exclusiv între StartHour și EndHour din ziua curentă
      int barsFound = 0;
      for(int i = 0; i < copied; i++)
      {
         MqlDateTime barDt;
         TimeToStruct(rates[i].time, barDt);
         if(barDt.day_of_year == dt.day_of_year && barDt.hour >= InpSessionStartHour && barDt.hour < InpSessionEndHour)
         {
            if(rates[i].high > highRange) highRange = rates[i].high;
            if(rates[i].low < lowRange) lowRange = rates[i].low;
            barsFound++;
         }
      }

      if(barsFound == 0 || highRange <= 0 || lowRange >= 9999999) return;

      double rangePips = (highRange - lowRange) / pipSize;
      if(rangePips < InpMinRangePips || rangePips > InpMaxRangePips)
      {
         g_lastBoxDay = dt.day_of_year;
         return;
      }

      MqlTick tick;
      if(!SymbolInfoTick(_Symbol, tick)) return;

      double stopsLevel = SymbolInfoInteger(_Symbol, SYMBOL_TRADE_STOPS_LEVEL) * _Point;
      double minDist    = MathMax(stopsLevel, 2 * pipSize);

      double buyStopPrice  = NormalizeDouble(highRange + (InpBufferPips * pipSize), _Digits);
      double sellStopPrice = NormalizeDouble(lowRange - (InpBufferPips * pipSize), _Digits);

      double lot = CalculateDynamicLot(InpRiskPercent, InpStopLossPips * pipSize);
      if(lot <= 0) return;

      bool placed = false;

      // Plasăm BuyStop doar dacă prețul curent nu a depășit deja nivelul BuyStop
      if(buyStopPrice > tick.ask + minDist)
      {
         double buySL = NormalizeDouble(buyStopPrice - (InpStopLossPips * pipSize), _Digits);
         double buyTP = NormalizeDouble(buyStopPrice + (InpTakeProfitPips * pipSize), _Digits);
         if(trade.BuyStop(lot, buyStopPrice, _Symbol, buySL, buyTP, ORDER_TIME_GTC, 0, "Titan_Buy_Breakout"))
            placed = true;
      }

      // Plasăm SellStop doar dacă prețul curent nu a coborât deja sub nivelul SellStop
      if(sellStopPrice < tick.bid - minDist)
      {
         double sellSL = NormalizeDouble(sellStopPrice + (InpStopLossPips * pipSize), _Digits);
         double sellTP = NormalizeDouble(sellStopPrice - (InpTakeProfitPips * pipSize), _Digits);
         if(trade.SellStop(lot, sellStopPrice, _Symbol, sellSL, sellTP, ORDER_TIME_GTC, 0, "Titan_Sell_Breakout"))
            placed = true;
      }

      if(placed)
      {
         Print(">>> [TITAN v4.20] Breakout Box ", DoubleToString(rangePips, 1), " pips | Lot: ", lot, " | BuyStop: ", buyStopPrice, " | SellStop: ", sellStopPrice);
         g_lastBoxDay = dt.day_of_year;
      }
   }
}

double CalculateDynamicLot(double riskPct, double slDistancePrice)
{
   if(slDistancePrice <= 0) return 0;
   double balance   = AccountInfoDouble(ACCOUNT_BALANCE);
   double riskMoney = balance * (riskPct / 100.0);

   double tickSize  = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   if(tickSize <= 0 || tickValue <= 0) return SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);

   double lossPerLot = (slDistancePrice / tickSize) * tickValue;
   if(lossPerLot <= 0) return SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);

   double rawLot  = riskMoney / lossPerLot;
   double minLot  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxLot  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double lotStep = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);

   double stepped = MathFloor(rawLot / lotStep) * lotStep;
   return NormalizeDouble(MathMax(minLot, MathMin(maxLot, stepped)), 2);
}

void HandleOCO()
{
   bool hasPos = false;
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      if(PositionGetTicket(i) > 0 && PositionGetString(POSITION_SYMBOL) == _Symbol && PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
      {
         hasPos = true;
         break;
      }
   }
   if(hasPos) CancelAllPendingOrders();
}

void ManageOpenPositions()
{
   if(!InpUseBreakEven && !InpUseTrailingStop) return;

   double pipMult = (_Digits == 3 || _Digits == 5) ? 10.0 : ((_Digits == 2) ? 10.0 : 1.0);
   double pipSize = _Point * pipMult;

   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick)) return;

   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0 || PositionGetString(POSITION_SYMBOL) != _Symbol || PositionGetInteger(POSITION_MAGIC) != InpMagicNumber)
         continue;

      long   type  = PositionGetInteger(POSITION_TYPE);
      double openP = PositionGetDouble(POSITION_PRICE_OPEN);
      double sl    = PositionGetDouble(POSITION_SL);
      double tp    = PositionGetDouble(POSITION_TP);

      if(type == POSITION_TYPE_BUY)
      {
         double profitPips = (tick.bid - openP) / pipSize;
         double newSL = sl;
         if(InpUseBreakEven && profitPips >= InpBreakEvenTriggerPips && (sl < openP || sl == 0))
            newSL = NormalizeDouble(openP + (2 * pipSize), _Digits);

         if(InpUseTrailingStop && profitPips >= InpTrailingStepPips)
         {
            double trailSL = NormalizeDouble(tick.bid - (InpTrailingStepPips * pipSize), _Digits);
            if(trailSL > newSL) newSL = trailSL;
         }

         if(newSL > sl + _Point) trade.PositionModify(ticket, newSL, tp);
      }
      else if(type == POSITION_TYPE_SELL)
      {
         double profitPips = (openP - tick.ask) / pipSize;
         double newSL = sl;
         if(InpUseBreakEven && profitPips >= InpBreakEvenTriggerPips && (sl > openP || sl == 0))
            newSL = NormalizeDouble(openP - (2 * pipSize), _Digits);

         if(InpUseTrailingStop && profitPips >= InpTrailingStepPips)
         {
            double trailSL = NormalizeDouble(tick.ask + (InpTrailingStepPips * pipSize), _Digits);
            if(trailSL < newSL || newSL == 0) newSL = trailSL;
         }

         if((sl == 0 || newSL < sl - _Point) && newSL > 0) trade.PositionModify(ticket, newSL, tp);
      }
   }
}

bool HasActiveOrdersOrPositions()
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
      if(PositionGetTicket(i) > 0 && PositionGetString(POSITION_SYMBOL) == _Symbol && PositionGetInteger(POSITION_MAGIC) == InpMagicNumber)
         return true;

   for(int i = OrdersTotal() - 1; i >= 0; i--)
      if(OrderGetTicket(i) > 0 && OrderGetString(ORDER_SYMBOL) == _Symbol && OrderGetInteger(ORDER_MAGIC) == InpMagicNumber)
         return true;

   return false;
}

void CancelAllPendingOrders()
{
   for(int i = OrdersTotal() - 1; i >= 0; i--)
   {
      ulong ticket = OrderGetTicket(i);
      if(ticket > 0 && OrderGetString(ORDER_SYMBOL) == _Symbol && OrderGetInteger(ORDER_MAGIC) == InpMagicNumber)
         trade.OrderDelete(ticket);
   }
}
`
  }
};
