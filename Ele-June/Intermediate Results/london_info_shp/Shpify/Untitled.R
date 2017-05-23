#install.packages(c("ggplot2", "gstat", "sp", "maptools","gdal"))
require(ggplot2)
require(rgeos)
require(gstat) 
require(rgdal)
require(sp)
require(maptools)
require(readxl)
require(dplyr)
getwd()
df<-read.csv("/Users/June/Desktop/Data Capture/DNA/June's Part/June's Data/2015  PTALs Grid Values 280515.csv")
View(df)
# dff<-read.table("/Users/June/Desktop/Data Capture/DNA/June's Part/June's Data/2015  PTALs Grid Values/2015  PTALs Grid Values 280515.xlsx",header=TRUE)

############### I. GET THE DOTS ############################
coordinates(df) <- ~X+Y
plot(df)

summary(df)

# notGrid<-read.csv("/Users/June/Desktop/Data Capture/DNA/June's Part/June's Data/COA2011 AvPTAI2015.csv")
# View(notGrid)



############### II. create grids ############################

x.range <- as.integer(range(df@coords[,1]))
y.range <- as.integer(range(df@coords[,2]))
grd <- expand.grid(x=seq(from=x.range[1], to=x.range[2], by=20), y=seq(from=y.range[1], to=y.range[2], by=20))
plot(grd)


## convert grid to SpatialPixel class
coordinates(grd) <- ~ x+y
gridded(grd) <- TRUE

## test it out - this is a good way of checking that your sample points are all well within your grid. If they are not, try some different values in you r x and y ranges:
plot(grd, cex=0.01)
points(df, pch=1, col='red', cex=0.01)
title("Interpolation Grid and Sample Points")


######### III. Inverse Distance Weighting ###########################
idw<-idw(formula=AI2015 ~ 1, locations=df, newdata=grd)
idw.output=as.data.frame(idw)
names(idw.output)[1:3]<-c("long","lat","var1.pred")
# View(idw.output)
#plot(x=idw.output$long,y=idw.output$lat,fill=idw.output$var1.pred)

plot<-ggplot(data=idw.output,aes(x=long,y=lat))#start with the base-plot 
layer1<-c(geom_tile(data=idw.output,aes(fill=var1.pred)))#then create a tile layer and fill with predicted values
#layer2<-c(geom_path(data=boroughoutline,aes(long, lat, group=group),colour = "grey40", size=1)
plot+layer1+scale_fill_gradient(low="#FEEBE2", high="#7A0177")

########################## Well. shapefile... merging with attribute code. ##########################################
### 1. link borough code with shapefile. INCOME.
boroughs.shp<-readOGR("/Users/June/urbanDNA/Ele-June/June's Data/ESRI/London_Borough_Excluding_MHW.shp")
View(boroughs)

income <-read.csv("/Users/June/urbanDNA/data/Income_and_HousingValue_2009.csv",encoding="UTF-8")
View(income)

income$NAME<-gsub('_'," ",income$Borough)
#income<-cbind(income('NAME','Median_Weekly_Household_Income_.2009.'))
merged<-merge(boroughs.shp, income)
View(merged)
merged<-merged[-c(8,9,11:14)]

View(merged)
?writeOGR
writeOGR(obj=merged, dsn="Shapefiles", layer="income", driver="ESRI Shapefile")
########################## the line to run if restarting session################################
test <-readOGR("/Users/June/Desktop/Data Capture/DNA/June's Part/income_Shapefiles/income.shp")
###########################################################################################



View(test)


# the fortified shapefile. with attributes added as well
xy<-fortify(test,region = "NAME")
sp_merge<-merge(xy,test,by.x="id",by.y="NAME")
sp_merge$M_W_H_I<-as.numeric(sp_merge$M_W_H_I)

ggplot()+geom_path(data = sp_merge,aes(x=long,y=lat,group=group,fill=sp_merge$M_W_H_I))

# write out the csv.
class(sp_merge)
write.csv(sp_merge,file="houseIncome")

#### simulate another boundary...
test<-read.csv("houseIncome.csv")
View(test)



#### 2. PTAL 
# not grid form of PTAL
PTAL_ng <-read.csv("/Users/June/Desktop/Data Capture/DNA/June's Part/June's Data/COA2011 AvPTAI2015.csv")
View(PTAL_ng)

## found 2011 COA boundary shapefile. 
london0A<-readOGR("/Users/June/Desktop/Data Capture/DNA/June's Part/June's Data/ESRI/OA_2011_London_gen_MHW.shp")
View(london0A) ## it's really comprehensive OA<-WARD<-BOROUGH DATA...

londonPTAL_OA<-merge(london0A,PTAL_ng,by.x="OA11CD",by.y="COA2011", all.x =FALSE)
londonPTAL_OA<-londonPTAL_OA[,-c(2:14,16:17)] #hence the resultant shapefil has OA code, pop density, PTAL
class(londonPTAL_OA)
View(londonPTAL_OA)
################### logic of overlay interpolation between areas ####################################
# initial / source boudary with attributes column
#here test = merged
sc_boundary
View(sc_boundary)
######### 1. create /simulate another boundary shapefile       #################
# (will need to get it from the boundary points ele produced. reverse process of fortify.)
## here, use OA.
tg_boundary_sub<-londonPTAL_OA[1:500,]


######### 2. calculate.. for each new polygon, its composition. sum up. #################

## testing intersection and area ##
# ?gIntersection

inter2=gIntersection(tg_boundary_sub[2,], sc_boundary[2,])
is.null(inter2)

# inter2
# # plot(inter2)
#  gArea(inter2)
# inter2
# if(!is.null(inter2)){print('NULL')}
# ?area.poly
# plot(tg_boundary_sub[1:8,])
# plot(sc_boundary[1,])


## to avoid projection error.
is.projected(tg_boundary_sub)
is.projected(sc_boundary)
sc_boundary@proj4string <-tg_boundary_sub@proj4string
tg_boundary_sub@proj4string
identical(sc_boundary@proj4string,tg_boundary_sub@proj4string)


## export the shapefiles for testing in python

writeOGR(obj=sc_boundary, dsn="sc_boundary",layer="sc_boundary",driver="ESRI Shapefile")
writeOGR(obj=tg_boundary_sub, dsn="tg_boundary", layer="tg_boundary", driver="ESRI Shapefile")

sc_values<-as.numeric(sc_boundary$M_W_H_I)
### for loop to calculate overlay weighted 
tg_zone_value<-array()
for(i in 1:length(tg_boundary_sub)){
  value<-0
  for (j in 1:length(sc_boundary)){
    inters<-gIntersection(sc_boundary[j,],tg_boundary_sub[i,])
    if(!is.null(inters)){
      inters_ratio<-gArea(inters)/gArea(tg_boundary_sub[i,])
      sc_attr_val<-sc_values[j] #8 because column 8 is the attribute we need to extract
      inters_wt <-inters_ratio*sc_attr_val ## weighted intersection
    }else{inters_wt<-0}#if not intersecting then sc[j]'s contribution is zero
    # increment tg_zone_value
    value<-value+inters_wt
  }
  
  tg_zone_value[i]<-value
}
  
tg_zone_value #"interpolated value returned. in order. hence can be attached back to dataframe.


