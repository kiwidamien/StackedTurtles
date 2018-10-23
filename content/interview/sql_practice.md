Title: Prepping for the interview - SQL
Tags: interview practice, SQL
Date: 2018-10-21 23:00
Category: Interview
Summary: Links to a couple of useful resources for preparing for the SQL, whether it is for a data science or data analyst position.

# A collection of SQL problems

I published a collection of [exercises](https://github.com/kiwidamien/SQL_practice) on Github. The process for installing Postgres on OSX is described. Once you have cloned this repository and have PostgreSQL installed, loading the data into the databases is only a single terminal command.

There are (currently) 5 different databases to load; I will probably add to this collection over time. The format of the repo is that you are asked a question. An example from the Seattle Weather database asks:

>What are the 10 hottest days on record? Take hottest to mean 'highest maximum temperature'.

The result of the query is provided:

<table border="1">
  <tr>
    <th align="center">date_weather</th>
    <th align="center">inches_rain</th>
    <th align="center">temp_max</th>
    <th align="center">temp_min</th>
    <th align="center">did_rain</th>
  </tr>
  <tr valign="top">
    <td align="left">2009-07-29 00:00:00</td>
    <td align="right">0</td>
    <td align="right">103</td>
    <td align="right">71</td>
    <td align="left">f</td>
  </tr>
  <tr valign="top">
    <td align="left">1994-07-20 00:00:00</td>
    <td align="right">0</td>
    <td align="right">100</td>
    <td align="right">65</td>
    <td align="left">f</td>
  </tr>
  <tr valign="top">
    <td align="left">1981-08-09 00:00:00</td>
    <td align="right">0</td>
    <td align="right">99</td>
    <td align="right">68</td>
    <td align="left">f</td>
  </tr>
  <tr valign="top">
    <td align="left">1991-07-23 00:00:00</td>
    <td align="right">0</td>
    <td align="right">99</td>
    <td align="right">65</td>
    <td align="left">f</td>
  </tr>
  <tr valign="top">
    <td align="left">1960-08-09 00:00:00</td>
    <td align="right">0</td>
    <td align="right">99</td>
    <td align="right">59</td>
    <td align="left">f</td>
  </tr>
  <tr valign="top">
    <td align="left">1981-08-10 00:00:00</td>
    <td align="right">0</td>
    <td align="right">98</td>
    <td align="right">67</td>
    <td align="left">f</td>
  </tr>
  <tr valign="top">
    <td align="left">1960-08-08 00:00:00</td>
    <td align="right">0</td>
    <td align="right">98</td>
    <td align="right">66</td>
    <td align="left">f</td>
  </tr>
  <tr valign="top">
    <td align="left">1988-09-02 00:00:00</td>
    <td align="right">0</td>
    <td align="right">98</td>
    <td align="right">59</td>
    <td align="left">f</td>
  </tr>
  <tr valign="top">
    <td align="left">1979-07-16 00:00:00</td>
    <td align="right">0</td>
    <td align="right">98</td>
    <td align="right">63</td>
    <td align="left">f</td>
  </tr>
  <tr valign="top">
    <td align="left">1967-08-16 00:00:00</td>
    <td align="right">0</td>
    <td align="right">98</td>
    <td align="right">59</td>
    <td align="left">f</td>
  </tr>
</table>

What _isn't_ provided is the query to get there. You should experiment with the queries, and try to get a result that matches mine. (If you think my posted results are incorrect, please leave a Github Issue!) The choice to not publish the queries is a deliberate choice!

While this is setup to work with PostgreSQL out of the box, the answers to the queries should be the same with any database you use. You are free to use MySQL, Oracle, or any other database you want. You will just need to load the data CSVs into your database engine of choice.

### Will it work with SQLite3?

Yes, but please use a "real" database. SQLite3 is popular because it is extremely lightweight, and can be used on mobile devices, however it has strange behavior when used with aggregations that will be hard to "unlearn" when you use other databases.

PostgreSQL and MySQL are free -- give them a go instead!

## But wait ... interviews are also about doing analysis and explaining conclusions

Knowing how to turn a precise question, such as "how many users logged onto our website in January", into an SQL query and getting results is a necessary skill for a data analyst.

A more important skill is being able to take an ill-posed question, such as "why is our traffic down?", and breaking it into a series of precise questions that you can then get from the database to find a solution. This is the realm of the _case study_.

At the moment, my exercises only help you study the syntax of SQL. They don't help you with case studies. I am brainstorming ways of fixing this, that don't involve too much work. It is a non-trivial problem, as often times case studies require making assumptions about what you think are important metrics, and then checking those assumptions with project managers.

Here are the two best resources I know of for looking at case studies:

* [Mode Analytics Community Case Studies:](https://community.modeanalytics.com/sql/tutorial/sql-business-analytics-training/)

  Mode Analytics has 4 case studies on their community website. They allow you to query the data and make new charts in a Tableau-style interface. The case studies also have outlines of a possible answer that you can look at.

* [Case in Point:](https://www.amazon.com/CASE-POINT-Complete-Interview-Preparation-ebook/dp/B01INOIJPW)

  This is a series of books used to prepare consultants for interviews in their fields. You won't get any SQL experience from reading these books, but you will get a good sense of how a consultant break a problem from a domain they are not an expert in to a series of precise decisions they can query the data. The interviews are given as a back-and-forth between the interviewer and interviewee, which can help you get past asking clarifying questions about the problems, metrics, and data in the interview.

Please let me know if there are other resources out there that I have missed!
