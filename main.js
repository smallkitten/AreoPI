window.onload = load();

function load() {
  $.getJSON("/data/data.json", function(data) {
    $("#bloomProgress").css("width", data.growthSeason.bloom+"%");
    $("#growProgress").css("width", data.growthSeason.grow+"%");
    $("#plantProgress").css("width", data.growthSeason.sprout+"%");
    $("#sproutProgress").css("width", data.growthSeason.plant+"%");
    if (data.sprayer == "Off") {
      $("#sprayerAlert").addClass("alert-danger");
    }
    $("#dashboardOnOff").html(data.sprayer);
    $("#timeUntil").html("Next in: " + data.nextSpray + " min");
  });

  var path = window.location.pathname;
  var page = path.split("/").pop();
  if (page == 'settings') {
    timing();
  }
  if (page == '') {
    dashboard();
  }
}

function sprayerOn() {
  $.post("/api/sprayer",
      {
          sprayer: "on"
      },
      function(data, status){
          console.log(data);
          console.log(status);
      });
  $("#sprayerAlert").removeClass("alert-danger");
  $("#dashboardOnOff").html("On");
  $("#timeUntil").html("Spraying");
}

var lables = ["Monday", "Tuesday", "Wensday", "Thursday", "Friday", "Saturday", "Sunday"];

function dashboard() {
  var heading = document.getElementById('heading');
  heading.innerHTML = 'Dashboard';
  var content = document.getElementById('content');
  content.innerHTML = `
                        <h3 class="text-center">Ph Values</h3>
                        <canvas id="myPH" width="200" height="100"></canvas>
                        <hr>
                        <h3 class="text-center">EC Values</h3>
                        <canvas id="myEC" width="200" height="100"></canvas>
                        <hr>
                        <h3 class="text-center">Tempatures</h3>
                        <canvas id="myTemps" width="200" height="100"></canvas>
                        <hr>
                        <h3 class="text-center">Water Levals</h3>
                        <canvas id="myWater" width="200" height="100"></canvas>
                        `;
  $.getJSON("/data/data.json", function(data) {
    var ctx = document.getElementById("myPH");
    var myPH = new Chart(ctx, {
      type: 'line',
      data: {
        labels: lables,
        datasets: [{
          label: 'PH value',
          data: data.ph,
          fill: false,
          backgroundColor: [
            '#A31621',
          ],
          borderColor: [
            '#5E1621',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

    var ctx = document.getElementById("myEC");
    var myEC = new Chart(ctx, {
      type: 'line',
      data: {
        labels: lables,
        datasets: [{
          label: 'EC value',
          data: data.ec,
          fill: false,
          backgroundColor: [
            '#1F7A8C',
          ],
          borderColor: [
            '#005060',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

    var ctx = document.getElementById("myTemps");
    var myTemps = new Chart(ctx, {
      type: 'line',
      data: {
        labels: lables,
        datasets: [{
          label: 'Tempatures',
          data: data.tempatures,
          fill: false,
          backgroundColor: [
            '#E3B505',
          ],
          borderColor: [
            '#776002',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    var ctx = document.getElementById("myWater");
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          data: data.water.tank1,
          label: 'Tank One',

          // This binds the dataset to the left y axis
          yAxisID: 'left-y-axis',
          backgroundColor: [
            '#1B4965',
          ],
          borderColor: [
            '#133549',
          ],
          fill: false
        }, {
          data: data.water.tank2,
          label: 'Tank Two',

          // This binds the dataset to the right y axis
          yAxisID: 'right-y-axis',

          backgroundColor: [
            '#42CAFD',
          ],
          borderColor: [
            '#236E89',
          ],
          fill: false
        }],
        labels: lables
      },
      options: {
        scales: {
          yAxes: [{
            id: 'left-y-axis',
            type: 'linear',
            position: 'left'
          }, {
            id: 'right-y-axis',
            type: 'linear',
            position: 'right'
          }]
        }
      }
    });
  });
}

function changePH() {
  var heading = document.getElementById('heading');
  heading.innerHTML = 'PH';
  var content = document.getElementById('content');
  content.innerHTML = `
                        <canvas id="myChart" width="300" height="150"></canvas>
                        <form class="form-inline" id="ph-form">
                          <div class="form-group">
                            <label class="sr-only" for="exampleInputAmount">Amount (in dollars)</label>
                            <div class="input-group">
                              <div class="input-group-addon"><span class="glyphicon glyphicon-tint" aria-hidden="true"></span></div>
                                <input type="text" class="form-control" id="phAmount" placeholder="Amount">
                              <div class="input-group-addon">ml</div>
                            </div>
                          </div>
                          <button type="submit" class="btn main-color" id="addButton">Add</button>
                          <div id="phAlert" class="input-group"></div>
                        </form>
                      `;

  $.getJSON("/data/data.json", function(data) {
    var phForm = document.getElementById('ph-form');
    phForm.addEventListener("submit", addPH);
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: lables,
        datasets: [{
          label: 'PH value',
          data: data.ph,
          fill: false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  });
}

function addPH(e) {
  if (e.preventDefault) e.preventDefault();
  var phAmount = document.getElementById('phAmount')
  if (phAmount.value != '' && parseInt(phAmount.value)) {
    document.getElementById('phAlert').innerHTML = '<div class="alert alert-success" id="formAlert" role="alert"><strong>Sucsess!</strong>' + phAmount.value + 'ml of PH up added.</div>';
    $.post("/api/ph",
        {
            ph: phAmount.value,
        },
        function(data, status){
            console.log(data);
            console.log(status);
        });
  } else {
    alert("Please enter a valid PH amount");
  }
  return false;
}

function changeEC() {
  var heading = document.getElementById('heading');
  heading.innerHTML = 'PPM and Nutrents';
  var content = document.getElementById('content');
  content.innerHTML = `
                        <canvas id="myChart" width="300" height="150"></canvas>
                        <form class="form-inline" id="ec-form">
                          <div class="form-group">
                            <label class="sr-only" for="exampleInputAmount">Amount (in dollars)</label>
                            <div class="input-group">
                              <div class="input-group-addon" id="nutrentDiv"><span class="glyphicon glyphicon-tint" aria-hidden="true"></span></div>
                                <input type="text" class="form-control" id="growAmount" placeholder="Grow">
                                <input type="text" class="form-control" id="floraAmount" placeholder="Flora">
                                <input type="text" class="form-control" id="bloomAmount" placeholder="Bloom">
                              <div class="input-group-addon">ml</div>
                            </div>
                          </div>
                          <button type="submit" class="btn main-color">Add</button>
                          <div id="ecAlert" class="input-group"></div>
                        </form>
                        `;

  $.getJSON("/data/data.json", function(data) {
    var ecForm = document.getElementById('ec-form');
    ecForm.addEventListener("submit", addEC);
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: lables,
        datasets: [{
          label: 'EC value',
          data: data.ec,
          fill: false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  });
}

function addEC(e) {
  if (e.preventDefault) e.preventDefault();
  var floraAmount = document.getElementById('floraAmount');
  var bloomAmount = document.getElementById('bloomAmount');
  var growAmount = document.getElementById('growAmount');
  if (parseInt(floraAmount.value) >= 0 && parseInt(bloomAmount.value) >= 0 && parseInt(floraAmount.value) >= 0) {
    document.getElementById('ecAlert').innerHTML = '<div class="alert alert-success" id="formAlert" role="alert"><strong>Sucsess!</strong> ' + floraAmount.value + 'ml of Flora added, ' + growAmount.value + 'ml of Grow added, and ' + bloomAmount.value + 'ml of Bloom added.</div>';
    $.post("/api/nutrents",
        {
            flora: floraAmount.value,
            bloom: bloomAmount.value,
            grow: growAmount.value
        },
        function(data, status){
            console.log(data);
            console.log(status);
        });
  } else {
    alert("Please enter a valid nutrent amount");
  }
  return false;
}

function viewTemp() {
  var heading = document.getElementById('heading');
  heading.innerHTML = 'Tempatures';
  var content = document.getElementById('content');
  content.innerHTML = '<canvas id="myChart" width="300" height="150"></canvas>';

  $.getJSON("/data/data.json", function(data) {
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: lables,
        datasets: [{
          label: 'Tempatures',
          data: data.tempatures,
          fill: false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  });
}

function viewWater() {
  var heading = document.getElementById('heading');
  heading.innerHTML = 'Water Levals';
  var content = document.getElementById('content');
  content.innerHTML = `
                        <h3 class="text-center">Tank One:</h3>
                        <div class="progress">
                          <div id="tank1" class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <h3 class="text-center">Tank Two:</h3>
                        <div class="progress">
                          <div id="tank2" class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <canvas id="myChart" width="300" height="150"></canvas>
                        <a href="/settings" class="btn main-color" id="manageNotifcations"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span>Manage Notifcations</a>
                        `;

  $.getJSON("/data/data.json", function(data) {
    var tank1 = (data.water.tank1Current - 0) * (100 - 0) / (1000 - 0) + 0; //Need to make a settings and json value for min and max in tank
    $("#tank1").css("width", tank1+"%");
    var tank2 = (data.water.tank2Current - 0) * (100 - 0) / (1000 - 0) + 0; //Need to make a settings and json value for min and max in tank
    $("#tank2").css("width", tank2+"%")

    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          data: data.water.tank1,
          label: 'Tank One',

          // This binds the dataset to the left y axis
          yAxisID: 'left-y-axis',
          backgroundColor: [
            '#1B4965',
          ],
          borderColor: [
            '#133549',
          ],
          fill: false
        }, {
          data: data.water.tank2,
          label: 'Tank Two',

          // This binds the dataset to the right y axis
          yAxisID: 'right-y-axis',

          backgroundColor: [
            '#42CAFD',
          ],
          borderColor: [
            '#236E89',
          ],
          fill: false
        }],
        labels: lables
      },
      options: {
        scales: {
          yAxes: [{
            id: 'left-y-axis',
            type: 'linear',
            position: 'left'
          }, {
            id: 'right-y-axis',
            type: 'linear',
            position: 'right'
          }]
        }
      }
    });
  });
}

// settings:
function notifcations() {
  var heading = document.getElementById('settingsHeading');
  heading.innerHTML = 'Notifcations';
  var content = document.getElementById('settingsContent');
  content.innerHTML = `
                      <h3>Current Information:</h3>
                      <p id="name">Name: Jon Doe</p>
                      <p id="email">Email: not@set.com</p>
                      <hr>
                      <h3>Notifcation Email and Name</h3>
                      <p>Please enter an email address to recive notifications from your system</p>
                      <form class="form" action="/" method="post">
                        <div class="form-group">
                          <label for="name">Name</label>
                          <input type="text" class="form-control" id="name" placeholder="Name">
                        </div>
                        <div class="form-group">
                          <label for="email">Email</label>
                          <input type="email" class="form-control" id="email" placeholder="Email Address">
                        </div>
                        <button type="submit" class="btn btn-default main-color">Update Information</button>
                      </form>
                      <hr>
                      <h3>Recive notifcations about:</h3>

                      <div class="checkbox">
                      <label>
                        <input type="checkbox" value="" id="waterLevals1">
                        Water levals in tank 1
                      </label>
                      </div>
                      <div class="checkbox">
                        <label>
                          <input type="checkbox" value="" id="waterLevals2">
                          Water levals in tank 2
                        </label>
                      </div>
                      <div class="checkbox">
                        <label>
                          <input type="checkbox" value="" id="temps">
                          High tempature levals
                        </label>
                      </div>
                      <div class="checkbox">
                        <label>
                          <input type="checkbox" value="" id="ph">
                          High PH
                        </label>
                      </div>
                      <div class="checkbox">
                        <label>
                          <input type="checkbox" value="" id="despensing">
                          Despensing
                        </label>
                      </div>
                      <div class="checkbox">
                        <label>
                          <input type="checkbox" value="" id="growth">
                          Groth Season
                        </label>
                      </div>
                      <button type="button" name="button" class="btn main-color" id="submit">Submit</button>
                      `;

  $.getJSON("/data/settings.json", function(data) {
    var json = data;
    $("#name").html(json.notifcations.notificationName);
    $("#email").html(json.notifcations.notificationEmail);
    if (json.notifcations.notifcationOption1) {
      $("#waterLevals1").wrap('<input type="checkbox" value="" id="waterLevals1" checked>');
    }
    else {
      $("#waterLevals1").wrap('<input type="checkbox" value="" id="waterLevals1">');
    }

    if (json.notifcations.notifcationOption2) {
      $("#waterLevals2").wrap('<input type="checkbox" value="" id="waterLevals1" checked>');
    }
    else {
      $("#waterLevals2").wrap('<input type="checkbox" value="" id="waterLevals1">');
    }

    if (json.notifcations.notifcationOption3) {
      $("#temps").wrap('<input type="checkbox" value="" id="waterLevals1" checked>');
    }
    else {
      $("#temps").wrap('<input type="checkbox" value="" id="waterLevals1">');
    }

    if (json.notifcations.notifcationOption4) {
      $("#ph").wrap('<input type="checkbox" value="" id="waterLevals1" checked>');
    }
    else {
      $("#ph").wrap('<input type="checkbox" value="" id="waterLevals1">');
    }

    if (json.notifcations.notifcationOption5) {
      $("#despensing").wrap('<input type="checkbox" value="" id="waterLevals1" checked>');
    }
    else {
      $("#despensing").wrap('<input type="checkbox" value="" id="waterLevals1">');
    }

    if (json.notifcations.notifcationOption6) {
      $("#growth").wrap('<input type="checkbox" value="" id="waterLevals1" checked>');
    }
    else {
      $("#growth").wrap('<input type="checkbox" value="" id="waterLevals1">');
    }
  });
}

function wifi() {
  var heading = document.getElementById('settingsHeading');
  heading.innerHTML = 'Wifi Network';
  var content = document.getElementById('settingsContent');
  content.innerHTML = `
                      <h3>Current Information:</h3>
                      <p id="name">SSID: Jon Doe</p>
                      <hr>
                      <h3>Wifi SSID and password</h3>
                      <p>Please enter you new network SSID and password.</p>
                      <div class="alert alert-warning" role="alert"><strong>Please Note:</strong> This is intended to update your network information. Upon clicking submit, your pi's network will change.</div>
                      <form class="form" action="/" method="post">
                        <div class="form-group">
                          <label for="ssid">SSID</label>
                          <input type="text" class="form-control" id="ssid" placeholder="SSID">
                        </div>
                        <div class="form-group">
                          <label for="password">Password</label>
                          <input type="password" class="form-control" id="password" placeholder="Password">
                        </div>
                        <button type="submit" class="btn btn-default main-color">Update Network Info</button>
                      </form>
                      `;

  $.getJSON("/data/settings.json", function(data) {
    var json = data;
    $("#name").html(json.wifi.oldSSID);
  });
}

function timing() {
  var heading = document.getElementById('settingsHeading');
  heading.innerHTML = 'Spray Timeing';
  var content = document.getElementById('settingsContent');
  content.innerHTML = `
                      <h3>Current Information:</h3>
                      <p id="currentInfo">Spray every <strong id="currentMinutes">5</strong> minutes for <strong id="currentTime">10</strong> secounds</p>
                      <hr>
                      <h3>Options:</h3>
                      <div class="alert alert-info" role="alert"><strong>Info:</strong> For more information about spraying times, please see this great article: <a target="_blank" href="http://aeroponicsdiy.com/aeroponics-misting-frequency-for-root-growth/">Aeroponics Misting Frequency</a></div>
                      <h3>Custom:</h3>
                      <p>Interval between</p>
                      <div class="input-group">
                        <span class="input-group-addon">
                          <span class="glyphicon glyphicon-time" aria-hidden="true"></span>
                        </span>
                        <input type="text" class="form-control" placeholder="Interval" id="interval">
                      </div>
                      <br>
                      <p>Secounds on</p>
                      <div class="input-group">
                        <span class="input-group-addon">
                          <span class="glyphicon glyphicon-time" aria-hidden="true"></span>
                        </span>
                        <input type="text" class="form-control" placeholder="Secounds" id="secounds">
                      </div>
                      <h3>Presets:</h3>
                      <div class="checkbox">
                      <label>
                        <input type="checkbox" name="optionscheckboxs" id="optionscheckboxs1" value="option1">
                          Morning [5-8 AM]
                        </label>
                      </div>
                      <div class="checkbox">
                      <label>
                        <input type="checkbox" name="optionscheckboxs" id="optionscheckboxs2" value="option2">
                          Night [5-8 PM]
                        </label>
                      </div>
                      <div class="checkbox">
                      <label>
                        <input type="checkbox" name="optionscheckboxs" id="optionscheckboxs3" value="option3">
                          Morning and Night
                        </label>
                      </div>
                      <div class="checkbox">
                      <label>
                        <input type="checkbox" name="optionscheckboxs" id="optionscheckboxs4" value="option4">
                          All Day
                        </label>
                      </div>
                      <div class="checkbox">
                      <label>
                        <input type="checkbox" name="optionscheckboxs" id="optionscheckboxs4" value="option4">
                          Every five minutes for 30 secounds
                        </label>
                      </div>
                      <button type="button" name="button" class="btn main-color" id="save">Save</button>
                      `;

  $.getJSON("/data/settings.json", function(data) {
    var json = data;
    if (!json.sprayer.morning == true || json.sprayer.night == true) {
      $("#currentMinutes").html(json.sprayer.sprayInterval);
      $("#currentTime").html(json.sprayer.sprayTime);
    }
    if (json.sprayer.morning == true && json.sprayer.night == true) {
      $("#currentInfo").html("Spray every morning and night from 5 to 8");
      $("#optionscheckboxs3").wrap('<input type="checkbox" name="optionscheckboxs" id="optionscheckboxs3" value="option1" checked>');
    }
    else {
      if (json.sprayer.morning) {
        $("#currentInfo").html("Spray every morning from 5 to 8");
        $("#optionscheckboxs1").wrap('<input type="checkbox" name="optionscheckboxs" id="optionscheckboxs1" value="option1" checked>');
      }
      if (json.sprayer.night) {
        $("#currentInfo").html("Spray every night from 5 to 8");
        $("#optionscheckboxs2").wrap('<input type="checkbox" name="optionscheckboxs" id="optionscheckboxs2" value="option1" checked>');
      }
    }
    if (json.sprayer.day) {
      $("#currentInfo").html("Spray all day");
      $("#optionscheckboxs4").wrap('<input type="checkbox" name="optionscheckboxs" id="optionscheckboxs4 value="option1" checked>');
    }
  });
}

function despensing() {
  var heading = document.getElementById('settingsHeading');
  heading.innerHTML = 'Nutrents';
  var content = document.getElementById('settingsContent');
  content.innerHTML = `
                      <h3>Current Information:</h3>
                      <p id="currentFlora">Flora: <strong id="floraMl">5ml</strong></p>
                      <p id="currentGrow">Grow: <strong id="growMl">5ml</strong></p>
                      <p id="currentBloom">Bloom: <strong id="bloomMl">5ml</strong></p>
                      <p id="currentTime">Despensing every <strong id="day">Sunday</strong> at <strong id="time">5:00</strong></p>
                      <hr>
                      <h3>Options:</h3>
                      <div class="alert alert-info" role="alert"><strong>Info:</strong> For more information about proper nutrent amounts, see <a target="_blank" href="http://gh.growgh.com/docs/Feedcharts/GH_FloraSeries-REC_03216am.pdf">this PDF</a> by General Hydroponics </div>
                      <h4>Custom:</h4>
                      <p>Flora Amount:</p>
                      <form class="form-inline">
                        <div class="form-group">
                          <label class="sr-only" for="exampleInputAmount">Amount (in millilieaters)</label>
                          <div class="input-group">
                            <div class="input-group-addon"><span class="glyphicon glyphicon-tint" aria-hidden="true"></span></div>
                            <input type="text" class="form-control" id="floraAmount" placeholder="Amount">
                            <div class="input-group-addon">ml</div>
                          </div>
                        </div>
                        <button type="submit" class="btn main-color">Save</button>
                      </form>
                      <br>
                      <p>Grow Amount:</p>
                      <form class="form-inline">
                        <div class="form-group">
                          <label class="sr-only" for="exampleInputAmount">Amount (in millilieaters)</label>
                          <div class="input-group">
                            <div class="input-group-addon"><span class="glyphicon glyphicon-tint" aria-hidden="true"></span></div>
                            <input type="text" class="form-control" id="growAmount" placeholder="Amount">
                            <div class="input-group-addon">ml</div>
                          </div>
                        </div>
                        <button type="submit" class="btn main-color">Save</button>
                      </form>
                      <br>
                      <p>Bloom Amount:</p>
                      <form class="form-inline">
                        <div class="form-group">
                          <label class="sr-only" for="exampleInputAmount">Amount (in millilieaters)</label>
                          <div class="input-group">
                            <div class="input-group-addon"><span class="glyphicon glyphicon-tint" aria-hidden="true"></span></div>
                            <input type="text" class="form-control" id="bloomAmount" placeholder="Amount">
                            <div class="input-group-addon">ml</div>
                          </div>
                        </div>
                        <button type="submit" class="btn main-color">Save</button>
                      </form>
                      <br>
                      <h5>Timeing:</h5>
                      <p>Day:</p>
                      <div class="dropdown">
                      <button class="btn btn-default dropdown-toggle" type="button" id="day" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                          Day
                          <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                          <li><a href="#">Monday</a></li>
                          <li><a href="#">Tuesday</a></li>
                          <li><a href="#">Wendsay</a></li>
                          <li><a href="#">Thursday</a></li>
                          <li><a href="#">Friday</a></li>
                          <li><a href="#">Saturday</a></li>
                          <li><a href="#">Sunday</a></li>
                        </ul>
                      </div>
                      <br>
                      <p>Time:</p>
                      <div class="dropdown">
                      <button class="btn btn-default dropdown-toggle" type="button" id="time" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                          Time
                          <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                          <li><a href="#">12:00 AM</a></li>
                          <li><a href="#">1:00 AM</a></li>
                          <li><a href="#">2:00 AM</a></li>
                          <li><a href="#">3:00 AM</a></li>
                          <li><a href="#">4:00 AM</a></li>
                          <li><a href="#">5:00 AM</a></li>
                          <li><a href="#">6:00 AM</a></li>
                          <li><a href="#">7:00 AM</a></li>
                          <li><a href="#">8:00 AM</a></li>
                          <li><a href="#">9:00 AM</a></li>
                          <li><a href="#">10:00 AM</a></li>
                          <li><a href="#">11:00 AM</a></li>
                          <li><a href="#">12:00 PM</a></li>
                          <li><a href="#">1:00 PM</a></li>
                          <li><a href="#">2:00 PM</a></li>
                          <li><a href="#">3:00 PM</a></li>
                          <li><a href="#">4:00 PM</a></li>
                          <li><a href="#">5:00 PM</a></li>
                          <li><a href="#">6:00 PM</a></li>
                          <li><a href="#">7:00 PM</a></li>
                          <li><a href="#">8:00 PM</a></li>
                          <li><a href="#">9:00 PM</a></li>
                          <li><a href="#">10:00 PM</a></li>
                          <li><a href="#">11:00 PM</a></li>
                        </ul>
                      </div>
                      <hr>
                      <h3>Presets:</h3>
                      <div class="checkbox">
                      <label>
                        <input type="checkbox" name="optionscheckboxs" id="optionscheckboxs1" value="option1">
                          Every Sunday at 5:00
                        </label>
                      </div>
                      <div class="checkbox">
                      <label>
                        <input type="checkbox" name="optionscheckboxs" id="optionscheckboxs2" value="option2">
                          Every Wensday at 5:00
                        </label>
                      </div>
                      <div class="checkbox">
                      <label>
                        <input type="checkbox" name="optionscheckboxs" id="optionscheckboxs3" value="option3">
                          Every Sunday and Wendsay at 5:00
                        </label>
                      </div>
                      <div class="checkbox">
                      <label>
                        <input type="checkbox" name="optionscheckboxs" id="optionscheckboxs4" value="option4">
                          Every Day at 5:00 <strong>Not recomended!</strong>
                        </label>
                      </div>
                      <button type="button" name="button" class="btn main-color" id="save">Save</button>
                      `;

  $.getJSON("/data/settings.json", function(data) {
    var json = data;
    $("#floraMl").html(json.nutrents.floraAmount);
    $("#bloomMl").html(json.nutrents.bloomAmount);
    $("#growMl").html(json.nutrents.growAmount);
    $("#day").html(json.nutrents.day);
    $("#time").html(json.nutrents.time);
    if (json.nutrents.day == "Sunday" && json.nutrents.time == "5:00 PM") {
      $("#optionscheckboxs1").wrap('<input type="checkbox" name="optionscheckboxs" id="optionscheckboxs1" value="option1"checked>');
    }
    if (json.nutrents.day == "Wensday" && json.nutrents.time == "5:00 PM") {
      $("#optionscheckboxs2").wrap('<input type="checkbox" name="optionscheckboxs" id="optionscheckboxs2" value="option1"checked>');
    }
    if (json.nutrents.day == "Wensday and Sunday" && json.nutrents.time == "5:00 PM") {
      $("#optionscheckboxs3").wrap('<input type="checkbox" name="optionscheckboxs" id="optionscheckboxs3" value="option1"checked>');
    }
    if (json.nutrents.day == "day" && json.nutrents.time == "5:00 PM") {
      $("#optionscheckboxs4").wrap('<input type="checkbox" name="optionscheckboxs" id="optionscheckboxs4" value="option1"checked>');
    }
  });
}

function ph() {
  var heading = document.getElementById('settingsHeading');
  heading.innerHTML = 'PH Levals';
  var content = document.getElementById('settingsContent');
  content.innerHTML = `
                      <h3>Current Information:</h3>
                      <p>Keep ph leval at <strong id="phTarget">7</strong></p>
                      <hr>
                      <h3>Options:</h3>
                      <div class="alert alert-info" role="alert"><strong>Info:</strong> For more information about proper ph levals, see <a target="_blank" href="http://www.growthtechnology.com/growtorial/what-is-the-ph-value/">this website</a> by Groth Techonlogy for more information</div>
                      <h3>Custom:</h3>
                      <p>Keep PH levals at:</p>
                      <form class="form-inline">
                        <div class="form-group">
                          <label class="sr-only" for="exampleInputAmount">Leval (based on PH scale)</label>
                          <div class="input-group">
                            <div class="input-group-addon"><span class="glyphicon glyphicon-tint" aria-hidden="true"></span></div>
                            <input type="text" class="form-control" id="phAmount" placeholder="Leval">
                            <div class="input-group-addon"></div>
                          </div>
                        </div>
                        <button type="submit" class="btn main-color">Save</button>
                      </form>
                      <br>
                      `;

  $.getJSON("/data/settings.json", function(data) {
    var json = data;
    $("#phTarget").html(json.phTarget);
  });
}
