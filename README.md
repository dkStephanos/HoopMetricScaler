# HoopMetricScaler

HoopMetricScaler is a comprehensive full-stack application designed to analyze and scale various basketball metrics. By leveraging machine learning and detailed data visualizations, HoopMetricScaler provides deep insights into player performance and helps identify trends based on historic data.

![image](https://github.com/dkStephanos/HoopMetricScaler/blob/main/frontend/public/github-header.png)

## Table of Contents
- [HoopMetricScaler](#hoopmetricscaler)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Project Structure](#project-structure)
  - [Usage](#usage)
  - [Examples](#examples)
  - [Machine Learning Approach](#machine-learning-approach)
    - [Model Training](#model-training)
  - [Contributing](#contributing)
  - [License](#license)
  - [Data Sources](#data-sources)

## Installation

To get started with HoopMetricScaler, follow the steps below to install and launch the application using Docker Compose.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Steps

1. Clone the repository:
    ```sh
    git clone https://github.com/dkStephanos/HoopMetricScaler.git
    cd HoopMetricScaler
    ```

2. Launch the application:
    ```sh
    docker-compose up --build
    ```

3. Open your browser and navigate to `http://localhost:3000` to access the app.

## Project Structure

The project structure is organized as follows:

```bash
HoopMetricScaler/
├── backend/
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── controllers/     # Route controllers
│   ├── services/        # Business logic
│   ├── app.js           # Express app setup
│   ├── server.js        # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Application pages
│   │   ├── utils/       # Utility functions
│   │   ├── App.js       # Main app component
│   │   ├── index.js     # Entry point of the application
│   │   ├── theme.js     # MUI theme configuration
│   ├── public/
│   │   ├── icon.png     # App icon
│   │   ├── index.html   # HTML template
│   ├── package.json     # NPM dependencies and scripts
├── .env                 # Environment variables (if any)
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile           # Dockerfile for the app
├── README.md            # Project README

```

## Usage

Once the application is up and running, you can explore various features:

- **Historic Team Catalog**: Browse through years of historic team/player data all sourced live from the NBA API.
- **Player Dashboards**: View detailed dashboards for individual NBA players, including regular and advanced statistics.
- **Metric Scaling**: Use the sliders to adjust minutes and usage rate to see how player statistics scale.
- **Data Visualization**: Leverage interactive charts and graphs to visualize player performance trends.

## Examples

Here are some examples of the app in action:

**Figure 1**: Player Dashboard

**Figure 2**: Metric Scaling

## Machine Learning Approach

HoopMetricScaler employs a robust machine learning approach to normalize and scale player metrics. The training data is sourced from Basketball Reference, and the dashboard visualizations use data from the NBA JavaScript API.

### Model Training

1. **Data Collection**: Historical player statistics are gathered from Basketball Reference.
2. **Feature Engineering**: Relevant features such as minutes played, usage rate, and other advanced metrics are engineered.
3. **Model Training**: Various machine learning models are trained and evaluated to predict player performance based on the engineered features.
4. **Model Application**: The trained models are used to scale player's base statistics according to shifts in opportunity.

## Contributing

We welcome contributions from the community. To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Data Sources

- **Training data**: [Basketball Reference](https://www.basketball-reference.com/)
- **Dashboard data**: [NBA JavaScript API](https://github.com/bttmly/nba)
