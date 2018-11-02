Title: Data Lakes, Data Warehouses and Databases - Oh My! 
Tags: Database, Storage
Date: 2018-11-02 17:00
Category: Tools 
Summary: What is the difference between a production database and a data warehouse? How does that differ from a data lake? Why would I use one over the other? With the volume of data around, there are more and more use cases for data storage. This article covers the use cases and clarifies some of the terms used.

# Types of data storage

In this article, we look at the difference between three different storage types:

* **Production database** (aka "Prod")

  Fast, responsive database used by your application to display information to end users. Typically the perview/responsibility of software engineering. Exists in pretty much all applications.

* **Data warehouse**

  Stores more information than prod in a structured way. Used by analysts, data scientists, and machine learning engineers. Data in a data warehouse typically has an end goal in mind (e.g. we need this data to track metric X). Generally the responsibility of the data science and product teams. Exists in pretty much all applciations.

* **Data lake**

  Place that raw / unstructured data is placed. If there are changes in definitions or proxies, this allows reprocessing of data into the data warehouse. It also allows exploration of data that isn't currently being used for additional relevant signals. Generally of interest to the data science team, or new ideas from the product team. 

## Production database

The production database is the database used by your application when it actually retrieves information. For example, a customers orders would appear in a production database because the application needs that information to display it when the user clicks on the "Order history" button. The production database might not include every page the user has visited, unless the application needs that for a recommendation engine (even then, we might only record the items the user viewed, rather than every single page and click in the production database). 

The production database is generally designed for the software developers, and needs to be fast and responsibe (the application has to wait until the production database returns information before it can be displayed to the user). 

## Data Warehouse

The data warehouse (or analytics database) is used by the data scientists and analytics teams. It is generally an SQL database, and is optimized for the standard models run by the analytics, data science, and marketing teams. 

The data warehouse typically contains more data than the production database, because it contains data useful for analytics that isn't directly used by the application. Keeping the Data Warehouse separate from Prod also means that long-running analyses will not impact the load or response time of the application. 

The Warehouse supports standard scripts for tracking existing metrics, and creating the dashboards. Often new metrics can be obtained by combining data already in the Warehouse in different ways. 

## Data Lake

A data lake is not necessarily a database. It is a place where all the data is stored, typically in it original (raw) form. It can be stored in a non-relational database such as MongoDB, or simply live on a distributed file system (such as HDFS or Amazon S3 buckets).

If the product team comes up with new metrics which needs data that hasn't been set up in the data warehouse, the data lake provides a way of retreiving the historical data to check the past performance of the new metric. The Machine Learning and Data Science teams can the Data Lake to explore new hypothesis and data sources as well.

Data Lakes typically need a lot of data, but you don't require quick access to it. Any particular piece of data is accessed infrequently, and is kept around in case a use for it is discovered later. As data in the Data Lake is found useful, it is generally transferred into the data warehouse, and standard analysis are built around it.

Data Lakes are still relatively rare. The company has to be willing to invest in building long-term storage of data that there isn't an immediate need for. Data Lakes seem like they would be relatively easy to setup, as they require cheap, long term, slow storage for information that will be accessed relatively infrequently. However, careful planning is required to make sure your Data Lake doesn't turn into a _data swamp_.

### Data Lake vs Data Swamp

Data Lakes don't always keep the data stored in a database. When the data is stored in a distributed file system, such as HDFS or using cloud services, it can be difficult to find and locate the information of interest. A huge pile of data with no structure and no discoverability becomes can easily become a mess. 

A store of raw data that has so little structure that nothing can be found, and no one knows what is in there, is termed a "Data Swamp". There are those in the community that think that Data Lakes are all destined to become Data Swamps, and argue against implementing Lakes in the first place. 

## Summary

Data Lake is still a little bit of a fuzzy term, so it is difficult to give hard-and-fast rules for what qualifies as a "Data Lake". This table gives guidelines for the differences between these different types of data storage.

| | Production | Data Warehouse | Data Lake |
|---|---|---|---|
| **Data** | Structured data needed by the application to run | Structured data used to generate standard reports, run existing analysis | Raw dump of data. Includes data that doesn't fit into an existing work flow. |
| **Structured** | Yes | Yes | No |
| **Type** | Depends | Relational (SQL) | Unstructured (NoSQL) or File system (e.g. HDFS) | 
| **Users** | Software developers | Data scientists, ML engineers, analysts | Data scientists, ML engineers, analysts |
| **Performance** | Fastest | Fast | Slow |
| **Amount stored** | Smallest | Medium | Most |

### Other resources

* [International Institute Of Analytics: The Data Lake Debate](https://iianalytics.com/analytics-resources/the-data-lake-debate) featuring Tamara Dull (for the pro-data lake side) and Anne Buff (for the cons)
* [Database design from OpenCampus](https://opentextbc.ca/dbdesign01/chapter/chapter-13-database-development-process/)
* [Amazon's data lake page](https://aws.amazon.com/big-data/datalakes-and-analytics/what-is-a-data-lake/)
