import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import LIFF_SDK from '@salesforce/resourceUrl/LIFF_SDK';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateCaseForm extends LightningElement {
  /**
   * 子コンポーネント制御変数
   *   isFromLine   : LINE経由での画面表示？
   *   isInput      : 入力画面表示？
   *   isConfirm    : 入力確認画面表示？
   *   isCreated    : 問い合わせ作成済み？
   *   isLastNotion : 問い合わせ起票確認画面表示？
   */
  isInput;
  isConfirm;
  isLastNotion;
  isFromLine;

  /**
   * LINE情報格納
   */
  lineUserId;
  lineDisplayName;
  linePictureUrl;
  lineStatusMessage;

  /**
   * 入力値格納変数
   */
  inputUserLastName;
  inputUserFirstName;
  inputUserPhone;
  inputUserEmail;
  inputDate;
  inputDivision;
  inputDetail;

  /**
   * 初期処理１ : 子コンポーネント初期表示
   */
   connectedCallback() {
    this.isInput = true;
    this.isConfirm = false;
    this.isLastNotion = false;
  }

  /**
   * 初期処理２ :
   *   LIFFライブラリ(SDK)の読み込み
   *   LINEプロファイル情報の読み込み・取得
   */
  renderedCallback() {
    Promise.all([
      loadScript(this, LIFF_SDK),
        ])
        .then(async() => {
            await this.initLIFF();
        })
        .catch(error => {
          let evt = new ShowToastEvent({
            title: 'JSライブラリロードに失敗しました',
            message: error.message,
            variant: 'error',
          });
          this.dispatchEvent(evt);
        });
  }

  /**
   * LINE プロファイル情報取得機能
   */
  getProfile() {
    if(!liff.isLoggedIn()){
      this.isFromLine = false;
      return;
    }
    liff.getProfile()
      .then(profile => {
        this.isFromLine = true;
        this.lineUserId = profile.userId;
        this.lineDisplayName = profile.displayName;
        this.linePictureUrl = profile.pictureUrl;
        this.lineStatusMessage = profile.statusMessage;
      })
      .catch((error) => {
        this.isFromLine = false;
        alert("LIFF のプロファイル情報取得処理(liff.getProfile())でエラーが発生しました。 : " + error);
      });
  }

  /**
   * LIFF SDK 初期化処理
   *   初期処理１からの呼び出し
   *   LINEプロファイル情報を取得
   */
  async initLIFF() {
    liff.init({
      liffId: "1657345707-RdGgJgYQ"
      //liffId: "{!$Label.LiffID}"
    })
      .then(async() => {
        await this.getProfile();
      })
      .catch((err) => {
        alert("LIFF の初期化処理(liff.init())でエラーが発生しました。 : " + err);
      });
  }

  /**
   * 入力用子コンポーネントからの値取得・格納
   */
  handleclickforinput(event){
    this.inputUserLastName = event.detail.inputUserLastName;
    this.inputUserFirstName = event.detail.inputUserFirstName;
    this.inputUserPhone = event.detail.inputUserPhone;
    this.inputUserEmail = event.detail.inputUserEmail;
    this.inputDate = event.detail.inputDate;
    this.inputDivision = event.detail.inputDivision;
    this.inputDetail = event.detail.inputDetail;
    this.isInput = event.detail.isInput;
    this.isConfirm = event.detail.isConfirm;
    this.isLastNotion = event.detail.isLastNotion;
  }

  handleclickback(event){
    this.isInput = event.detail.isInput;
    this.isConfirm = event.detail.isConfirm;
    this.isLastNotion = event.detail.isLastNotion;
  }

  handleclicksend(event){
    this.isInput = event.detail.isInput;
    this.isConfirm = event.detail.isConfirm;
    this.isLastNotion = event.detail.isLastNotion;
  }

  handleclickclose(event){
    this.inputUserLastName = event.detail.inputUserLastName;
    this.inputUserFirstName = event.detail.inputUserFirstName;
    this.inputUserPhone = event.detail.inputUserPhone;
    this.inputUserEmail = event.detail.inputUserEmail;
    this.inputDate = event.detail.inputDate;
    this.inputDivision = event.detail.inputDivision;
    this.inputDetail = event.detail.inputDetail;
    this.isInput = event.detail.isInput;
    this.isConfirm = event.detail.isConfirm;
    this.isLastNotion = event.detail.isLastNotion;

    this.template.querySelector("c-create-case-form-input").setResetFlag();
  }
}
