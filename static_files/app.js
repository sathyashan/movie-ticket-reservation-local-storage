var app = angular.module("reservationApp", ['ngStorage']);

app.controller("mainCtrl", function ($scope, $timeout, $localStorage) {
    $scope.totalSeats = 96;
    if ($localStorage.movieReservation === undefined) {
        $localStorage.movieReservation = { totalSeatsBooked: 0, bookings: [] };
    }
    $scope.startBooking = function () {
        //input validation
        if ($scope.nameInput != "" && $scope.numTicketInput != "" && $scope.numTicketInput === parseInt($scope.numTicketInput, 10) && $scope.numTicketInput > 0) {
            //checking seat availability
            if ($scope.numTicketInput <= ($scope.totalSeats - $localStorage.movieReservation.totalSeatsBooked)) {
                $scope.isSeatingArrangementVisible = true
            }
            else {
                var toastMessage = "oops! only " + ($scope.totalSeats - $localStorage.movieReservation.totalSeatsBooked) + " tickets available";
                $scope.showToastMessage(toastMessage);
            }

        }
        else {
            var toastMessage = "Input(s) are missing or not valid";
            $scope.showToastMessage(toastMessage);
        }

    };
    $scope.showToastMessage = function (msg) {
        $scope.toastMessage = msg;
        $scope.isToastMessageVisible = true;
        $timeout(function () {
            $scope.isToastMessageVisible = false;
        }, 2000)
    };
    $scope.ngRepeatFor = function (num) {
        var temp = [];
        for (var i = 1; i <= num; i++)
            temp.push(i);
        return temp;
    }
    $scope.resetUserInput = function () {
        $scope.numTicketInput = "";
        $scope.nameInput = "";
    }

});
//localstorage --->  {totalSeats: 96, totalSeatsBooked: 2, bookings:[name: "name", numSeats: 2, seats:["A12,A11"]]}
app.controller("seatCtrl", function ($scope, $localStorage, $timeout) {
    $scope.userSelectedSeats = [];

    var reservedSeats = [];
    $scope.bookings = $localStorage.movieReservation.bookings || [];
    $scope.seatRows = [{ seatSerial: "A", selectedSeats: [] }, { seatSerial: "B", selectedSeats: [] }, { seatSerial: "C", selectedSeats: [] }, { seatSerial: "D", selectedSeats: [] }, { seatSerial: "E", selectedSeats: [] }, { seatSerial: "F", selectedSeats: [] }, { seatSerial: "G", selectedSeats: [] }, { seatSerial: "H", selectedSeats: [] }];
    //concat all booked seats into Reservedseats local variable
    for (var i = 0; i < $scope.bookings.length; i++) {
        reservedSeats = reservedSeats.concat($scope.bookings[i].seats);
    }

    for (var i = 0; i < reservedSeats.length; i++) {
        switch (reservedSeats[i].slice(0, 1)) {
            case "A":
                $scope.seatRows[0].selectedSeats.push(reservedSeats[i].slice(1));
                break;
            case "B":
                $scope.seatRows[1].selectedSeats.push(reservedSeats[i].slice(1));
                break;
            case "C":
                $scope.seatRows[2].selectedSeats.push(reservedSeats[i].slice(1));
                break;
            case "D":
                $scope.seatRows[3].selectedSeats.push(reservedSeats[i].slice(1));
                break;
            case "E":
                $scope.seatRows[4].selectedSeats.push(reservedSeats[i].slice(1));
                break;
            case "F":
                $scope.seatRows[5].selectedSeats.push(reservedSeats[i].slice(1));
                break;
            case "G":
                $scope.seatRows[6].selectedSeats.push(reservedSeats[i].slice(1));
                break;
            case "H":
                $scope.seatRows[7].selectedSeats.push(reservedSeats[i].slice(1));
                break;
        }
    }
    $scope.checkSelected = function (index, seatSelectedInRow) {
        if (seatSelectedInRow.length === 0) {
            return false;
        }
        //search index in the array
        for (var i = 0; i < seatSelectedInRow.length; i++) {
            //here +1 since we taking index of ngRepeat that starts with 0
            if (seatSelectedInRow[i] == index + 1) {
                return true;
            }
        }
        return false;
    }


    $scope.onClickSeat = function (e, seatNumber) {
        if (!angular.element(e.target).hasClass("seatReserved")) {
            //add if not present in list; remove if seatnumber present in userSelectedSeats
            for (var i = 0; i < $scope.userSelectedSeats.length; i++) {
                //seatnumber exists in the list, so remove it 
                if ($scope.userSelectedSeats[i] === seatNumber) {
                    $scope.userSelectedSeats.splice(i, 1);
                    angular.element(e.target).removeClass("seatSelected");
                    return;
                }
            }
            if ($scope.userSelectedSeats.length < $scope.numTicketInput) {
                $scope.userSelectedSeats.push(seatNumber);
                angular.element(e.target).addClass("seatSelected");
            }
            else {
                var msg = "Already " + $scope.numTicketInput + " seat(s) selected";
                $scope.showToastMessage(msg);
            }
        }
    }

    $scope.onClickConfirm = function () {
        var tickets = $scope.numTicketInput, name = $scope.nameInput, seats = $scope.userSelectedSeats;

        var bookingDetails = { name: name, numSeats: tickets, seats: seats };
        if ($scope.userSelectedSeats.length === tickets) {
            $localStorage.movieReservation.totalSeatsBooked += tickets;
            $localStorage.movieReservation.bookings.push(bookingDetails);
            //reset inputs
            $scope.resetUserInput();

            //show success message
            var msg = "Ticket booked successfully"
            $scope.showToastMessage(msg);
            
            $timeout(function () {
                location.reload(); //reload the page
            }, 2000);
            
        }
    }
    $scope.toggleHistoryText = "Show History";
    $scope.showHistory = false;
    $scope.toggleHistory = function(){
        $scope.showHistory = !$scope.showHistory;
        if($scope.showHistory){
            $scope.toggleHistoryText = "Show History";
        }
        else{
            $scope.toggleHistoryText = "Hide History";            
        }
    };
});