$(function() {
let modaltitlen = 'افزودن یاداشت';
let modaltitlei = 'افزودن هزینه';
$('#modaltitlen').html(modaltitlen);
$('#modaltitlei').html(modaltitlei);
$('#add-note').click(function() {
    modaltitlen = 'افزودن یاداشت';
    $('#modaltitlen').html(modaltitlen);
    $('#note-title').val("");
    $('#note-note').val("");
    $('#note-date').val("");
});
$('#add-item').click(function() {
    modaltitlei = 'افزودن هزینه';
    $('#modaltitlei').html(modaltitlei);
    $('#expense-title').val("");
    $('#expense-note').val("");
    $('#expense-date').val("");
});
$('.edit-note-btn').click(function() {
    modaltitlen = 'ویرایش یاداشت';
    $('#modaltitlen').html(modaltitlen);
});
$('.edit-expense-btn').click(function() {
    modaltitlei = 'ویرایش هزینه';
    $('#modaltitlei').html(modaltitlei);
});
function cvt(varValue) {
  /*check_var_type*/
  if (!isNaN(varValue)) {
    return 0; /*Numeric*/
  } else if (/^[a-zA-Z]+$/.test(varValue)) {
    return 1; /*Alphabetic*/
  } else {
    return "Neither Numeric nor Alphabetic";
  }
}



function pToe(string) {
  /*persianToEnglishDigits*/
  const replacePairs = {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9'
  };

  return string.replace(/[۰-۹٠-٩]/g, (match) => replacePairs[match]);
}


$(".datepicker").persianDatepicker({
  altField: "#altField",
  altFormat: "YYYY MM DD",
  observer: true,
  format: "YYYY/MM/DD",
  initialValue: false,
  autoClose: true,
  calendarType: "persian",
  navigator: {
    enabled: true,
    scroll: {
      enabled: true
    },
    text: {
      btnNextText: "<",
      btnPrevText: ">"
    }
  }
});


function number_format(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}




let options = { year: 'numeric', month: 'numeric', day: 'numeric' };
let today = new Date().toLocaleDateString('fa-IR', options);
let totalExpense = 0;

$(document).ready(() => {
      // Initialize notes and expenses in localStorage if not already set
      if (!localStorage.getItem('notes')) {
        const initialNotes = [{ title: 'تست یادداشت 1', note: 1000000, date: `${today}` }, { title: 'تست یاداشت 2', note: 1000000, date: `${today}` }];
        localStorage.setItem('notes', JSON.stringify(initialNotes));
      }

      if (!localStorage.getItem('expenses')) {
        const initialExpenses = [{ title: 'تست هزینه 1', expense: 1000000, date: `${today}` }, { title: 'تست هزینه 2', expense: 1000000, date: `${today}` }];
        localStorage.setItem('expenses', JSON.stringify(initialExpenses));
      }

      // Render notes and expenses lists
      renderNoteList();
      renderExpenseList();

      // Handle note form submit
      $('#note-form').submit((e) => {

let inputNoteArr = {
  Notetitle: $('#note-title').val(),
  Notebody: $('#note-body').val(),
  Notedate: $('#note-date').val()
};

let error = [];
if(!inputNoteArr.Notetitle) error.push('عنوان');
if(!inputNoteArr.Notebody) error.push('مبلغ');
if(!inputNoteArr.Notedate) error.push('تاریخ');

        if(!inputNoteArr.Notetitle || !inputNoteArr.Notebody || !inputNoteArr.Notedate)
        {
            errors = error.join('، ');
            alert(`فیلد های (${errors}) خالی است!`).dialog();
        }
        else
        {
        e.preventDefault();
        const notesArr = JSON.parse(localStorage.getItem('notes'));
        const noteObj = {
          title: $('#note-title').val(),
          note: $('#note-body').val(),
          date: $('#note-date').val()
        };
        notesArr.push(noteObj);
        localStorage.setItem('notes', JSON.stringify(notesArr));
        renderNoteList();
        $('#note-form')[0].reset();
        }
      });

      // Handle expense form submit
      $('#expense-form').submit((e) => {
        let inputExpenseArr = {
          Expensetitle: $('#expense-title').val(),
          Expensebody: $('#expense-body').val(),
          Expensedate: $('#expense-date').val()
        };

        let error = [];
        if(!inputExpenseArr.Expensetitle) error.push('عنوان');
        if(!inputExpenseArr.Expensebody) error.push('مبلغ');
        if(!inputExpenseArr.Expensedate) error.push('تاریخ');

        if(!inputExpenseArr.Expensetitle || !inputExpenseArr.Expensebody || !inputExpenseArr.Expensedate)
        {
            errors = error.join('، ');
            alert(`فیلد های (${errors}) خالی است!`);
        }
        else
        {
        e.preventDefault();
        const expensesArr = JSON.parse(localStorage.getItem('expenses'));
        const expenseObj = {
          title: $('#expense-title').val(),
          expense: $('#expense-body').val(),
          date: $('#expense-date').val()
        };
        expensesArr.push(expenseObj);
        localStorage.setItem('expenses', JSON.stringify(expensesArr));
        renderExpenseList();
        $('#expense-form')[0].reset();
        }
      });

      // Handle note edit button click
      $(document).on('click', '.edit-note-btn', function() {
        const noteIndex = $(this).data('index');
        const notesArr = JSON.parse(localStorage.getItem('notes'));
        const noteObj = notesArr[noteIndex];
        $('#edit-note-title').val(noteObj.title);
        $('#edit-note-body').val(noteObj.note);
        $('#edit-note-date').val(noteObj.date);
        $('#edit-note-modal').modal('show');

        // Handle edit note form submit
        $('#edit-note-form').submit((e) => {
          e.preventDefault();
          noteObj.title = $('#edit-note-title').val();
          noteObj.note = $('#edit-note-body').val();
          noteObj.date = $('#edit-note-date').val();
          localStorage.setItem('notes', JSON.stringify(notesArr));
          renderNoteList();
          $('#edit-note-modal').modal('hide');
        });
      });

      // Handle expense edit button click
      $(document).on('click', '.edit-expense-btn', function() {
        const expenseIndex = $(this).data('index');
        const expensesArr = JSON.parse(localStorage.getItem('expenses'));
        const expenseObj = expensesArr[expenseIndex];
        $('#edit-expense-title').val(expenseObj.title);
        $('#edit-expense-body').val(expenseObj.expense);
        $('#edit-expense-date').val(expenseObj.date);
        $('#edit-expense-modal').modal('show');

        // Handle edit expense form submit
        $('#edit-expense-form').submit((e) => {
          e.preventDefault();
          expenseObj.title = $('#edit-expense-title').val();
          expenseObj.expense = $('#edit-expense-body').val();
          expenseObj.date = $('#edit-expense-date').val();
          localStorage.setItem('expenses', JSON.stringify(expensesArr));
          renderExpenseList();
          $('#edit-expense-modal').modal('hide');
        });
      });

      // Handle note delete button click
      $(document).on('click', '.delete-note-btn', function() {
        const noteIndex = $(this).data('index');
        const notesArr = JSON.parse(localStorage.getItem('notes'));
        notesArr.splice(noteIndex, 1);
        localStorage.setItem('notes', JSON.stringify(notesArr));
        renderNoteList();
      });

      // Handle expense delete button click
      $(document).on('click', '.delete-expense-btn', function() {
        const expenseIndex = $(this).data('index');
        const expensesArr = JSON.parse(localStorage.getItem('expenses'));
        expensesArr.splice(expenseIndex, 1);
        localStorage.setItem('expenses', JSON.stringify(expensesArr));
        renderExpenseList();
      });

      // Render functions
      function renderNoteList() {
        const notesArr = JSON.parse(localStorage.getItem('notes'));
        let notesHtml = '';
        notesArr.forEach((noteObj, index) => {
          notesHtml += `
            <tr>
              <td>${noteObj.title}</td>
              <td>${number_format(noteObj.note)} تومان</td>
              <td>${noteObj.date}</td>
              <td>
              <div class="d-flex justify-content-center col-3 m-auto">
                <button type="button" class="m-1 btn btn-sm btn-warning rounded-pill edit-note-btn" data-index="${index}">ویرایش</button>
                <button type="button" class="m-1 btn btn-sm btn-danger rounded-pill delete-note-btn" data-index="${index}">حذف</button>
              </div>
              </td>
            </tr>
          `;
        });
        $('#note-list').html(notesHtml);
      }
      function renderExpenseList() {
        const expensesArr = JSON.parse(localStorage.getItem('expenses'));
        let expensesHtml = '';
        expensesArr.forEach((expenseObj, index) => {
          expensesHtml += `
            <tr>
              <td>${expenseObj.title}</td>
              <td>${number_format(expenseObj.expense)} تومان</td>
              <td>${expenseObj.date}</td>
              <td>
              <div class="d-flex justify-content-center col-3 m-auto">
                <button type="button" class="m-1 btn btn-sm btn-warning rounded-pill edit-expense-btn" data-index="${index}">ویرایش</button>
                <button type="button" class="m-1 btn btn-sm btn-danger rounded-pill delete-expense-btn" data-index="${index}">حذف</button>
              </div>
              </td>
            </tr>
          `;
          totalExpense += parseInt(expenseObj.expense);
        });
        $('#expense-list').html(expensesHtml);
        $('#totalPlace').html(`${number_format(totalExpense)} تومان`);
      }
    });
});
