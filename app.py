#################################################
# Flask Application
#################################################

# Dependencies and Setup
from flask import Flask, render_template 



#################################################
# Flask Setup
#################################################
app = Flask(__name__)

# Route to render index.html template 
@app.route("/")
def index():

# Return the homepage
    return render_template("index.html")

# Route that will trigger the scrape function
@app.route("/plots")
def plots():

    # Redirect back to plots
    return render_template("plots.html")

if __name__ == "__main__":
    app.run(debug=True)