import { LightningElement, api } from 'lwc';

export default class CreateCaseFormLastNotion extends LightningElement {
  @api isFromLine;
  @api isInput;
  @api isConfirm;
  @api isLastNotion;
  /**
   * ボタン「確認」押下時処理
   */
  handleClickClose() {
    const inputEvent = new CustomEvent('handleclickclose', {
    detail: {
      inputUserLastName : '',
      inputUserFirstName : '',
      inputUserPhone : '',
      inputUserEmail : '',
      inputDate : '',
      inputDivision : '',
      inputDetail : '',
      isInput : true,
      isConfirm : false,
      isLastNotion : false
      }
    });
    this.dispatchEvent(inputEvent);
  }
}