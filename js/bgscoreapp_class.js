// bgscoreapp_class.js
"use strict";

class BgScoreApp {
  constructor() {
    this.setDomNames();
    this.setEventHandler();
    this.setSwipeEventHandler();
    this.flipcard = new FlipCard();
    this.settingVars = {}; //設定内容を保持するオブジェクト
  }

  setDomNames() {
    this.applybtn  = document.querySelector("#applybtn");
    this.cancelbtn = document.querySelector("#cancelbtn");
    this.score1    = document.querySelector("#score1");
    this.score2    = document.querySelector("#score2");
  }

  setEventHandler() {
    //設定画面の[RESET SCORE]ボタンがクリックされたとき
    this.applybtn.addEventListener("click", () => {
      this.flipcard.resetScore();
      this.flipcard.showMainPanel();
    });

    //設定画面の[CANCEL]ボタンがクリックされたとき
    this.cancelbtn.addEventListener("click", () => {
      this.flipcard.showMainPanel();
      this.loadSettingVars(); //transitionが終わってから書き戻す
    });

    //メイン画面の[SETTINGS]ボタンがクリックされたとき
    const settingbtns = ["#settingbtn", "#matchinfo"]; //ポイント表示部分も設定ボタンとして機能させる
    for (const btn of settingbtns) {
      document.querySelector(btn).addEventListener("click", () => {
        this.flipcard.showSettingPanel();
        this.saveSettingVars(); //元の値を覚えておく
      });
    }
  }

  setSwipeEventHandler() {
    //swipeイベントを登録
    new SwipeTracker(this.score1, "tl", 200); //tapかswipeleftのみを見張る。(rudはtapとみなす)
    new SwipeTracker(this.score2, "tl", 200);

    //スコアカードがスワイプあるいはタップされたとき→1枚めくる
    const eventlist = ["mytap", "swipeleft"];
    for (const eventtype of eventlist) {
      this.score1.addEventListener(eventtype, (evt) => { this.flipcard.driveEvent(evt); });
      this.score2.addEventListener(eventtype, (evt) => { this.flipcard.driveEvent(evt); });
    }
  }

  saveSettingVars() {
    this.settingVars.matchlength = document.querySelector("#matchlength").value;
  }

  loadSettingVars() {
    document.querySelector("#matchlength").value = this.settingVars.matchlength;
  }
}
