import { GluonElement, html } from '../../node_modules/gluonjs/gluon.js';

class AppElement extends GluonElement {
  get template() {
    return html`
      <link rel="stylesheet" href="./bootstrap.min.css">
      <style>
        :host {
          display: block;
        }
      </style>
      <div class="container">
        <div class="row">
      
          <div class="col-md-6 offset-md-3" style="margin-top: 200px">
      
            <div class="card">
              <div class="card-header">
                Login app
              </div>
      
              <div class="card-body">
                <div id="alert" class="alert" role="alert"></div>
      
                <form>
                  <div class="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input id="username" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                  </div>
      
                  <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input id="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
                  </div>
      
                  <button id="button" type="button" class="btn btn-primary">Submit</button>
      
                </form>
      
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.$.button.addEventListener('click', e => this.buttonClickHandler(e));
    this.requestStatus();
  }

  requestStatus() {
    fetch('/api/status')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('ERR');
        }
      })
      .then(alert => {
        this.setAlert(alert.text, alert.code);
      });
  }

  buttonClickHandler(e) {
    const username = this.$.username.value;
    const password = this.$.password.value;

    fetch('/api/login', {
      body: JSON.stringify({ username, password }), // must match 'Content-Type' header
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('ERR');
        }
      })
      .then(alert => this.setAlert(alert.text, alert.code));
  }

  setAlert(text, code) {
    if (code === 'red') {
      this.$.alert.classList.remove('alert-success');
      this.$.alert.classList.remove('alert-primary');
      this.$.alert.classList.add('alert-danger');
    }

    if (code === 'green') {
      this.$.alert.classList.remove('alert-danger');
      this.$.alert.classList.remove('alert-primary');
      this.$.alert.classList.add('alert-success');
    }

    if (code === 'blue') {
      this.$.alert.classList.remove('alert-success');
      this.$.alert.classList.remove('alert-danger');
      this.$.alert.classList.add('alert-primary');
    }

    this.$.alert.innerText = text;
  }
}

customElements.define(AppElement.is, AppElement);
