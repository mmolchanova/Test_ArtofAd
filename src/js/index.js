// Добавление в input'ы календаря DataTimePicker   
$(function () {
    let startDate = moment().add(1, 'days').hours(0).minutes(0).valueOf();  // Дата начала акции
    let finishDate = moment(startDate).add(7, 'days');  // Дата окончания акции
    let finishCheckInDate = moment(finishDate).subtract(3, 'hours');  // Дата окончания регистрации

    $('#datetimepicker1').datetimepicker({
        locale: 'ru',
        defaultDate: startDate
    });
    $('#datetimepicker2').datetimepicker({
        locale: 'ru',
        defaultDate: finishDate
    });
    $('#datetimepicker3').datetimepicker({
        locale: 'ru',
        defaultDate: finishCheckInDate
    });

    // Обработка изменений в полях с DataTimePicker
    $('#datetimepicker1').on("dp.change", function() {
        startDate = $('#datetimepicker1').data("DateTimePicker").date();
    });

    $('#datetimepicker2').on("dp.change", function() {
        finishDate = $('#datetimepicker2').data("DateTimePicker").date();
        finishCheckInDate = moment(finishDate).subtract(3, 'hours');
        $('#datetimepicker3').data("DateTimePicker").date(moment(finishCheckInDate));
    });

    $('#datetimepicker3').on("dp.change", function() {
        finishCheckInDate = $('#datetimepicker3').data("DateTimePicker").date();
    });              
});

// Обработка выбора в списке промоакций
$(function () {
    $('#selectPromo').change(function() {
        let value = $('#selectPromo').val();

        if (value == 'campaign') {
            $('#descriptionBlock').removeClass('hidden');
        } else {
            $('#descriptionBlock').addClass('hidden');
        }
        if (value == 'coupon') {
            $('#couponTab').removeClass('hidden');
        } else {
            $('#couponTab').addClass('hidden');
        }
    });
});

// Валидация главной формы
$(document).ready(function(){
    let startDate, finishDate, finishCheckInDate;   // Дата начала акции, дата окончания акции, дата окончания регистрации

    // Добавление методов для проверки дат
    $.validator.addMethod("startDate", function(value) {
        startDate = moment(value, "DD.MM.YYYY HH:mm");
        let now = moment();

        return (now.isBefore(startDate));
    }, "Не раньше текущей даты");

    $.validator.addMethod("finishDate", function(value) {
        let checkDate = moment(startDate).add(3, 'hours');;

        finishDate = moment(value, "DD.MM.YYYY HH:mm");

        return (checkDate.isBefore(finishDate) || checkDate.isSame(finishDate));
    }, "Не ранее 3 часов с начала");

    $.validator.addMethod("minCheckInDate", function(value) {
        finishCheckInDate = moment(value, "DD.MM.YYYY HH:mm");

        return (finishCheckInDate.isAfter(startDate) || finishCheckInDate.isSame(startDate));
    }, "Не ранее начала акции");

    $.validator.addMethod("maxCheckInDate", function(value) {
        finishCheckInDate = moment(value, "DD.MM.YYYY HH:mm");

        return (finishCheckInDate.isBefore(finishDate) || finishCheckInDate.isSame(finishDate));
    }, "Не позднее окончания акции");

    // Инициализация валидатора для главной формы
    $("#mainForm").validate({
        onfocusout: false,
        onkeyup: false,
        onclick: false,
        errorPlacement: function(error, element) {
            if (element.hasClass("input-date")) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        },

        rules:{
            inputName: {
                required: true,
                minlength: 5
            },
            startDate: {
                startDate: true
            },
            finishDate: {
                finishDate: true
            },
            finishCheckInDate: {
                minCheckInDate: true,
                maxCheckInDate: true
            },
            description: {
                required: true,
                minlength: 20
            }
        },

        messages:{
            inputName: {
                required: "Укажите название акции",
                minlength: "Не менее 5 символов"
            },
            description: {
                required: "Заполните описание акции (минимум 20 символов)",
                minlength: "Минимум 20 символов"
            }
        }
    });

    // Обработчик для кнопки валидации главной формы
    $('#btnMainForm').click(function(){ 
        $("#mainForm").valid();
    });
});

// Валидация формы с бонусными купонами   
$(document).ready(function(){

    // Добавление метода для проверки на целочисленность
    $.validator.addMethod("isInteger", function(value) {                    
        return (Number.isInteger(+value));
    }, "Укажите стоимость в виде целого положительного числа");       

    // Инициализация валидатора для формы с бонусными купонами
    $("#couponForm").validate({
        onfocusout: false,
        onkeyup: false,
        onclick: false,

        rules:{
            inputPrice: {
                required: true,
                number: true,
                min: 1,
                isInteger: true
            }
        },

        messages:{
            inputPrice: {
                required: "Укажите стоимость купона",
                number: "Укажите стоимость в виде целого положительного числа",
                min: "Укажите стоимость в виде целого положительного числа"
            }
        }
    });

    // Обработчик для кнопки валидации формы с бонусными купонами
    $('#btnCouponForm').click(function(){ 
        $("#couponForm").valid();
    });
});
