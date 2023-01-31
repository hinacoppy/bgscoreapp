// bgflipcard_class.js
"use strict";

class FlipCard {
  constructor() {
    this.setDomNames();
    this.resetScore();
  }

  setDomNames() {
    this.mainwin = $("#mainwindow");
    this.setting = $("#settingwindow");
    this.cardall = $(".card");
  }

  //設定パネルを横回転で表示
  showSettingPanel() {
    this.setting.show();
    this.mainwin.addClass("fliphoriz90").on("transitionend",  () => {
      this.setting.addClass("fliphoriz0");
      this.mainwin.off("transitionend").hide();
    });
  }

  //メインパネルを横回転で表示
  showMainPanel() {
    this.mainwin.show();
    this.cardall.removeClass("flipup90 flipdn90 flipup0 flipdn0"); //タップ連打でバグった時に解除する
    this.setting.removeClass("fliphoriz0").on("transitionend",  () => {
      this.mainwin.removeClass("fliphoriz90");
      this.setting.off("transitionend").hide();
    });
  }

  //イベントに対応して操作を実行
  driveEvent(evt) {
    evt.preventDefault(); //カスタムイベントなので不要だが、記述しておく
    const player = parseInt(evt.currentTarget.id.slice(-1));
    if (evt.type == "mytap") {
      const opt = {delta: +1, transform_n: "next", transition_c: "flipup90", transition_n: "flipup0"};
      this.flipCard(player, opt);
    } else if (evt.type == "swipeleft" || evt.type == "swipedown") {
      const opt = {delta: -1, transform_n: "prev", transition_c: "flipdn90", transition_n: "flipdn0"};
      this.flipCard(player, opt);
    }
  }

  //カードをめくる
  flipCard(player, opt) {
    const cardcurr = $("#score" + player + "curr");
    const cardnext = $("#score" + player + "next");

    const scrcurr = this.score[player];
    const scrnext = this.calcNextScore(scrcurr, opt.delta);
    this.score[player] = scrnext;

    if (scrcurr == scrnext) { return; }

    cardnext.text(scrnext).show().addClass(opt.transform_n);
    cardcurr.addClass(opt.transition_c).on("transitionend",  () => {
      cardcurr.off("transitionend");
      cardnext.addClass(opt.transition_n).on("transitionend",  () => {
        cardnext.off("transitionend").hide().removeClass(opt.transition_n).removeClass(opt.transform_n);
        cardcurr.text(scrnext).removeClass(opt.transition_c);
        this.checkCrawford(player);
      });
    });
  }

  //カードをめくる
  ZZZZflipCard(player, opt) {
    const cardcurr = document.querySelector("#score" + player + "curr");
    const cardnext = document.querySelector("#score" + player + "next");

    const scrcurr = this.score[player];
    const scrnext = this.calcNextScore(scrcurr, opt.delta);
    this.score[player] = scrnext;

    if (scrcurr == scrnext) { return; }

    cardnext.textContent = (scrnext);
    cardnext.style.display = "";
    cardnext.classList.add(opt.transform_n);
    cardcurr.classList.add(opt.transition_c);
    cardcurr.addEventListener("transitionend",  () => {
//      cardcurr.off("transitionend");
      cardnext.classList.add(opt.transition_n);
      cardnext.addEventListener("transitionend",  () => {
//        cardnext.off("transitionend").hide().removeClass(opt.transition_n).removeClass(opt.transform_n);
        cardnext.style.display = "none";
        cardnext.classList.remove(opt.transition_n);
        cardnext.classList.remove(opt.transform_n);
        cardcurr.textContent = (scrnext);
        cardcurr.classList.remove(opt.transition_c);
        this.checkCrawford(player);
      });
    });
  }

  //次カードのスコアを計算
  calcNextScore(sc, delta) {
    let nx = sc + delta;
    if (this.matchlen != 0 && nx > this.matchlen) { nx = this.matchlen; }
    if (nx < 0) { nx = 0; }
    return nx;
  }

  //Crawfordかどうかを判断
  checkCrawford(player) {
    let cfstr;
    if (this.matchlen == 0) {
      cfstr = "";
    } else if (this.score[1] == this.matchlen || this.score[2] == this.matchlen) {
      cfstr = "MATCH";
    } else if (this.score[1] == this.score[2] && this.matchlen - this.score[player] == 1) {
      cfstr = "DMP";
    } else if (this.matchlen - this.score[player] == 1 && this.crawford == 0) {
      this.crawford = 1; this.cfplayer = player;
      cfstr = "Crawford";
    } else if (this.matchlen - this.score[this.cfplayer] == 1) {
      this.crawford = 0;
      cfstr = "Post<br>Crawford";
    } else {
      this.crawford = 0; this.cfplayer = 0;
      cfstr = "";
    }
    document.querySelector("#crawfordinfo").innerHTML = cfstr;
  }

  //設定画面でapplyした際に初期設定に戻す
  resetScore() {
    this.score = [0, 0, 0];
    this.crawford = 0;
    this.cfplayer = 0;
    this.showMatchInfo();
    document.querySelector("#crawfordinfo").textContent = "";
    document.querySelector("#score1curr").textContent = this.score[1];
    document.querySelector("#score1next").textContent = this.score[1];
    document.querySelector("#score2curr").textContent = this.score[2];
    document.querySelector("#score2next").textContent = this.score[2];
    this.checkCrawford(0); //1ptマッチの時DMPと表示させる
  }

  showMatchInfo() {
    const matchinfo = document.querySelector("#matchlength").value;
    const matchlen = parseInt(matchinfo);
    this.matchlen = matchlen ? matchlen : 9999; //$ -> 9999
    document.querySelector("#matchinfo").textContent = matchinfo;
  }
}
