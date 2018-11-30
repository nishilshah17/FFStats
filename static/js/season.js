var access_token = '{{ access_token }}';
var uid = '{{ uid }}';
var league_id = '{{ league_id }}';
var season = '{{ season }}';

// FIREBASE STUFF
var config = {
  apiKey: "AIzaSyAj619jd3xmYZbUSQPBS9kkjzKJvyAXBEc",
  authDomain: "ffstats-f2558.firebaseapp.com",
  databaseURL: "https://ffstats-f2558.firebaseio.com",
  projectId: "ffstats-f2558",
  storageBucket: "ffstats-f2558.appspot.com",
  messagingSenderId: "339504328835"
};

firebase.initializeApp(config);
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

var leagueRef = db.collection("leagues").doc(league_id);
var seasonRef = leagueRef.collection("seasons").doc(season);
var matchups = {};

$(document).ready(function() {
    $('.ui.dropdown').dropdown();
    $('#season').append(season);

    function getMatchupsForWeek(week) {
      // empty div
      $('#matchups').empty();
      $('#loader').removeClass('disabled');
      $('#loader').addClass('active');
      // add matchups for week
      seasonRef.collection('matchups').where('week', '==', parseInt(week)).get().then(snapshot => {
        if(snapshot.docs.length == 0) {
          alert('Nothing for this week');
        } else {
          for(var i = 0; i < snapshot.docs.length; i++) {
            var doc = snapshot.docs[i];
            var data = doc.data();

            if(data.matchupType != "bye") {
              let awayPoints = data.away.totalTeamPoints;
              let homePoints = data.home.totalTeamPoints;
              let winner = data.winner;

              let awayRef = data.away.teamId;
              let homeRef = data.home.teamId;

              awayRef.get().then(awaySnap => {
                var awayData = awaySnap.data();

                homeRef.get().then(homeSnap => {
                  var homeData = homeSnap.data();

                  let awayName = awayData.teamLocation + ' ' + awayData.teamNickname;
                  let awayAbbrev = awayData.teamAbbrev;
                  let homeName = homeData.teamLocation + ' ' + homeData.teamNickname;
                  let homeAbbrev = homeData.teamAbbrev;

                  $('#loader').removeClass('active');
                  $('#loader').addClass('disabled');
                  if(winner == "away") {
                    $('#matchups').append('<div class="ui card"><div class="content"><div class="ui center aligned two column grid"><div class="column"><div class="header">' + awayName + '</div><div class="meta">' + awayAbbrev + '</div></div><div class="column"><div class="header">' + homeName + '</div><div class="meta">' + homeAbbrev + '</div></div></div></div><div class="extra content"><div class="ui two buttons"><div class="ui basic green button">' + awayPoints + '</div><div class="ui basic red button">' + homePoints + '</div></div></div></div>');
                  } else {
                    $('#matchups').append('<div class="ui card"><div class="content"><div class="ui center aligned two column grid"><div class="column"><div class="header">' + awayName + '</div><div class="meta">' + awayAbbrev + '</div></div><div class="column"><div class="header">' + homeName + '</div><div class="meta">' + homeAbbrev + '</div></div></div></div><div class="extra content"><div class="ui two buttons"><div class="ui basic red button">' + awayPoints + '</div><div class="ui basic green button">' + homePoints + '</div></div></div></div>');
                  }
                });
              });
            }
          }
        }
      });
    }

    function displayMatchups() {
      // add tab menu
      $('#leftMenu').empty();
      var sections = ["Week 1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
      for(var i = 0; i < sections.length; i++) {
        if (i == 0) {
          $('#leftMenu').append('<a class="active tabactive item weekitem">' + sections[i] + '</a>');
        } else {
          $('#leftMenu').append('<a class="item weekitem">' + sections[i] + '</a>');
        }
      }
    }

    $(document).on('click', '.weekitem', function(){
        var weekText = $('.tabactive').text();
        var week = weekText.split(' ')[1];
        $('.tabactive').text(week);
        $('.tabactive').removeClass('active');
        $('.tabactive').removeClass('tabactive');

        weekText = $(this).text();
        $(this).text('Week ' + weekText);
        $(this).addClass('active');
        $(this).addClass('tabactive');

        getMatchupsForWeek(parseInt(weekText));
    });

    $('.menuitem').click(function() {

    });

    displayMatchups();
    getMatchupsForWeek(1);
});
