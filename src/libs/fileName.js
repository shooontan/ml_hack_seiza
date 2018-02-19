// @flow

// 日付のフォーマットを統一
function DateFormat(num) {
  if (num < 10) {
    return `0${num}`;
  }
  return num;
}

export default function FileName() {
  // ファイル名のプレフィクス
  const prefix = 'seiza';

  // 現在時間
  const date = new Date();
  const year = date.getFullYear();
  const month = DateFormat(date.getMonth() + 1);
  const day = DateFormat(date.getDate());
  const hour = DateFormat(date.getHours());
  const min = DateFormat(date.getMinutes());
  const sec = DateFormat(date.getSeconds());

  // pre_yyyymmdd_hhmmss
  return `${prefix}_${year}${month}${day}_${hour}${min}${sec}`;
}
