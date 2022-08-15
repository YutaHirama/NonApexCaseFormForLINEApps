import { LightningElement, api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CASE_OBJECT from '@salesforce/schema/Case';
import LINE_USER_ID_FIELD from '@salesforce/schema/Case.LINEUserId__c';
import LINE_USER_NAME_FIELD from '@salesforce/schema/Case.LINEUserName__c';
import LINE_USER_MESSAGE_FIELD from '@salesforce/schema/Case.LINEUserMessage__c';
import LINE_USER_IMAGE_FIELD from '@salesforce/schema/Case.LINEUserImage__c';
import SUPPLIED_NAME_FIELD from '@salesforce/schema/Case.SuppliedName';
import SUPPLIED_PHONE_FIELD from '@salesforce/schema/Case.SuppliedPhone';
import SUPPLIED_EMAIL_FIELD from '@salesforce/schema/Case.SuppliedEmail';
import INPUT_REQUEST_DATE_FIELD from '@salesforce/schema/Case.InputRequestDate__c';
import TYPE_FIELD from '@salesforce/schema/Case.Type';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import ORIGIN_FIELD from '@salesforce/schema/Case.Origin';

export default class CreateCaseFormConfirm extends LightningElement {
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

  /**
   * LINE情報格納
   */
  @api lineUserId;
  @api lineDisplayName;
  @api linePictureUrl;
  @api lineStatusMessage;

  /**
   * 入力値格納変数
   */
  @api inputUserLastName;
  @api inputUserFirstName;
  @api inputUserPhone;
  @api inputUserEmail;
  @api inputDate;
  @api inputDivision;
  @api inputDetail;

  /**
   * ボタン「確認」押下時処理
   */
   handleClickBack() {
    const inputEvent = new CustomEvent('handleclickback', {
      detail: {
        isInput : true,
        isConfirm : false,
        isLastNotion : false
      }
    });
    this.dispatchEvent(inputEvent);
  }

  createCaseRecord(){
    const fields = {};

    let lastName = this.inputUserLastName == null ? '' : this.inputUserLastName;
    let firstName = this.inputUserFirstName == null ? '' : this.inputUserFirstName;

    // JSON形式での値格納
    fields[LINE_USER_ID_FIELD.fieldApiName] = this.lineUserId;
    fields[LINE_USER_NAME_FIELD.fieldApiName] = this.lineDisplayName;
    fields[LINE_USER_MESSAGE_FIELD.fieldApiName] = this.lineStatusMessage;
    fields[LINE_USER_IMAGE_FIELD.fieldApiName] = this.linePictureUrl;
    fields[SUPPLIED_NAME_FIELD.fieldApiName] = lastName + ' ' + firstName;
    fields[SUPPLIED_PHONE_FIELD.fieldApiName] = this.inputUserPhone;
    fields[SUPPLIED_EMAIL_FIELD.fieldApiName] = this.inputUserEmail;
    fields[INPUT_REQUEST_DATE_FIELD.fieldApiName] = this.inputDate;
    fields[TYPE_FIELD.fieldApiName] = this.inputDivision;
    fields[DESCRIPTION_FIELD.fieldApiName] = this.inputDetail;
    fields[ORIGIN_FIELD.fieldApiName] = 'Web';

    let recordInput = { apiName: CASE_OBJECT.objectApiName, fields }

    createRecord(recordInput)
      .then(result => {
        this.dispatchEvent(new ShowToastEvent({
            title: '成功！',
            message: '問い合わせを起票しました。',
            variant: 'success'
        }),);
    })
    .catch(error => {
      this.errorMsg = JSON.stringify(error);
      this.dispatchEvent(new ShowToastEvent({
          title: '警告！',
          message: '問い合わせを起票しました。 Salesforce社 既知のエラー。詳細はこちら → https://trailblazer.salesforce.com/issues_view?id=a1p3A000001GN1gQAG&title=community-guest-user-may-see-the-error-the-requested-resource-does-not-exist-while-creating-record-from-community-using-the-lightning-recordeditform',
          variant: 'warning'
        }),);
    });
  }

  /**
   * ボタン「確認」押下時処理
   */
   handleClickSend() {
    this.createCaseRecord();
    const inputEvent = new CustomEvent('handleclicksend', {
      detail: {
        isInput : false,
        isConfirm : true,
        isLastNotion : true
      }
    });
    this.dispatchEvent(inputEvent);
  }
}