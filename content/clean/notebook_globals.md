title: Globals Are Bad 
Tags: Clean code, best practices, notebooks, interview
Date: 2019-06-13 22:00
Category: Tools
Summary: Jupyter's use for quick experimentation encourages the use of global variables, as we may only have one connection to a database, or one dataframe used by all functions. The globals can lead to subtle, hard to debug problems. This article shows one technique for defending against "leaking data".



