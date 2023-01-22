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
    this.swipeTracker(this.score1, "l"); //tapかswipeleftのみを見張る。(rudはtapとみなす)
    this.swipeTracker(this.score2, "l");

    //スコアカードがスワイプあるいはタップされたとき→1枚めくる
    const eventlist = ["tap", "swipeleft"];
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

  swipeTracker(target, direction = "lrud") {
    const thresholdX = 200; //スワイプと判断する移動量は即値で決め打ち
    const thresholdY = 200;
    let startX = 0;
    let startY = 0;
    let moveX = 0;
    let moveY = 0;

    const evfn_touchstart = ((origevt) => {
      //イベントハンドラを登録
      target.addEventListener("mousemove",  evfn_swiping);
      target.addEventListener("touchmove",  evfn_swiping);
      target.addEventListener("mouseup",    evfn_touchend);
      target.addEventListener("mouseleave", evfn_touchend);
      target.addEventListener("touchend",   evfn_touchend);
      target.addEventListener("touchleave", evfn_touchend);

      //マウスイベントとタッチイベントの差異を吸収
      const ev = (origevt.type === "mousedown") ? origevt : origevt.touches[0];
      //開始座標記録
      startX = ev.pageX;
      startY = ev.pageY;
      moveX = 0;
      moveY = 0;
    });

    const evfn_swiping = ((origevt) => {
      //マウスイベントとタッチイベントの差異を吸収
      const ev = (origevt.type === "mousemove") ? origevt : origevt.touches[0];
      //タッチ開始時からの差分
      moveX = ev.pageX - startX;
      moveY = ev.pageY - startY;
    });

    const evfn_touchend = ((origevt) => {
      //イベント監視を止める
      target.removeEventListener("mousemove",  evfn_swiping);
      target.removeEventListener("touchmove",  evfn_swiping);
      target.removeEventListener("mouseup",    evfn_touchend);
      target.removeEventListener("mouseleave", evfn_touchend);
      target.removeEventListener("touchend",   evfn_touchend);
      target.removeEventListener("touchleave", evfn_touchend);

      //イベントを判断し発火させる
      let eventtype = "tap";
      if      (direction.includes("l") && moveX < 0 && Math.abs(moveX) >= thresholdX) { eventtype = "swipeleft"; }
      else if (direction.includes("r") && moveX > 0 && Math.abs(moveX) >= thresholdX) { eventtype = "swiperight"; }
      else if (direction.includes("u") && moveY < 0 && Math.abs(moveY) >= thresholdY) { eventtype = "swipeup"; }
      else if (direction.includes("d") && moveY > 0 && Math.abs(moveY) >= thresholdY) { eventtype = "swipedown"; }
      target.dispatchEvent(new Event(eventtype));
    });

    //スタートイベントを登録
    target.addEventListener("mousedown",  evfn_touchstart);
    target.addEventListener("touchstart", evfn_touchstart);
  }
}
