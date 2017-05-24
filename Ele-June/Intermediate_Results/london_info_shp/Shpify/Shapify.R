require(ggplot2)
require(rgeos)
require(gstat) 
require(rgdal)
require(sp)
require(maptools)
require(readxl)
require(dplyr)
getwd()
df<-read.csv("london_info.csv")
View(df)


########################## Well. shapefile... merging with attribute code. ##########################################
### 1. link borough code with shapefile. INCOME.
wards.shp<-readOGR("wardShapefiles/London_Ward.shp")
wards.shp@proj4string

View(wards.shp)

?merge
merged<-merge(wards.shp, df,by.x='GSS_CODE',by.y='New.code')
View(merged)
# merged<-merged[-c(8,9,11:14)]


names(merged)[10]<-paste("pop15") #population in 2015
names(merged)[12]<-paste("num_jobs") #number of jobs
names(merged)[14]<-paste("income") #medium house income
names(merged)[15]<-paste("accessibility") #acceissibility
# merged<-merged[-c(11,13)]
# merged<-merged[-9]
View(merged)
?writeOGR
writeOGR(obj=merged, dsn="london_info_shp", layer="london_info", driver="ESRI Shapefile")


