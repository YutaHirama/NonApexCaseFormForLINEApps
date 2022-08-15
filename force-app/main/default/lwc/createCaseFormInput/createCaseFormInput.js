import { LightningElement, api , wire , track} from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import CASE_TYPE from '@salesforce/schema/Case.Type';

export default class CreateCaseFormInput extends LightningElement {
  /**
   * 子コンポーネント制御変数
   *   isFromLine   : LINE経由での画面表示？
   *   isInput      : 入力画面表示？
   *   isConfirm    : 入力確認画面表示？
   *   isLastNotion : 問い合わせ起票確認画面表示？
   */
  @api isFromLine;
  @api isInput;
  @api isConfirm;
  @api isLastNotion;
  isNotResettedInputValues = false;
  /**
   * LINE情報格納
   */
  @api lineUserId;
  @api lineDisplayName;
  @api linePictureUrl;
  @api lineStatusMessage;

  /**
   * 「問い合わせ区分」選択値格納変数
   */
  @track caseTypeInputOptions;

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
   * ボタン制御変数
   */
  disableBtn = true;

  renderedCallback() {
    this.resetInputValue();
  }

  /**
   * 入力値をリセットする。
   */
  resetInputValue() {
    if(this.isNotResettedInputValues){
      this.isNotResettedInputValues = false;
      this.template.querySelectorAll('.inputField').forEach(element => {
        if(element.type === 'checkbox' || element.type === 'checkbox-button'){
          element.checked = false;
        }else{
          element.value = null;
        }
      });
    }
  }

  /**
   * 入力値リセットフラグの制御
   *   親コンポーネント「createCaseForm」から呼び出し
   */
  @api setResetFlag(){
    this.isNotResettedInputValues = true;
  }

  /**
   * 標準オブジェクトCase情報の取得
   */
  @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
  caseInfo;

  /**
   * 問い合わせ区分選択値の取得
   *   Case標準項目「種別」(Type)から選択値を取得
   */
  @wire(getPicklistValues,{
    recordTypeId: '$caseInfo.data.defaultRecordTypeId',
    fieldApiName: CASE_TYPE
  }) caseTypeOptions({data}) {
    if(data){
      let options = [];
      for(let key in data.values){
        if(Object.prototype.hasOwnProperty.call(data.values, key)){
          options.push({ label: data.values[key].label, value: data.values[key].value });
        }
      }
      this.caseTypeInputOptions = options;
    }
  };

  /**
   * 共通処理：入力値チェック
   *   フォームに入力された値の不正チェック
   *     #ボタン非活性も制御
   */
  checkCreateCase() {
    this.disableBtn = false;
    let inputFields = this.template.querySelectorAll('.inputField');

    inputFields.forEach(inputField => {
      //checkValidity : 検証を行い、それが妥当であれば（ここでは必須な要素に入力が行われていれば）trueを、そうでなければfalseを返す。
      //reportValidity : checkValidityメソッドと同様に検証を行うが、フォーム上の要素で検証に失敗した要素についてはその旨を表示する
      // 参考：https://atmarkit.itmedia.co.jp/ait/articles/1702/10/news033.html
      if(!inputField.checkValidity()) {
        inputField.reportValidity();
        this.disableBtn = true;
      }
    });
    return !this.disableBtn;
  }

  /**
   * フォーム入力時のアクション
   */
  changeLastName(event) {
    this.inputUserLastName = event.detail.value;
    this.checkCreateCase();
  }
  changeFirstName(event) {
    this.inputUserFirstName = event.detail.value;
    this.checkCreateCase();
  }
  changePhone(event) {
    this.inputUserPhone = event.detail.value;
    this.checkCreateCase();
  }
  changeEmail(event) {
    this.inputUserEmail = event.detail.value;
    if(this.inputUserEmail == null || this.inputUserEmail === ''){
      this.disableBtn = true;
    } else {
      this.disableBtn = false;
    }
    this.checkCreateCase();
  }
  changeDate(event) {
    this.inputDate = event.detail.value;
    this.checkCreateCase();
  }
  changeDivision(event) {
    this.inputDivision = event.detail.value;
    this.checkCreateCase();
  }
  changeDetail(event) {
    this.inputDetail = event.detail.value;
    this.checkCreateCase();
  }

  /**
   * ボタン「確認」押下時処理
   */
  handleclickforinput() {
    if(this.checkCreateCase()) {
      const inputEvent = new CustomEvent('handleclickforinput', {
        detail: {
          // フォーム入力値
          inputUserLastName : this.inputUserLastName,
          inputUserFirstName : this.inputUserFirstName,
          inputUserPhone : this.inputUserPhone,
          inputUserEmail : this.inputUserEmail,
          inputDate : this.inputDate,
          inputDivision : this.inputDivision,
          inputDetail : this.inputDetail,
          // 画面制御変数
          isInput : false,
          isConfirm : true,
          isLastNotion : false
        }
     });
     this.dispatchEvent(inputEvent);
    }
  }
}