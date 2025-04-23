drop table action;
drop table actiontype;
drop table texture;
drop table material;
drop table model;
drop table modeltype;
drop table xtuser;

create table xtuser	/*用户信息表*/
(
	uid char(20) primary key,	/*用户ID*/
	pwd char(20),				/*密码*/
	telno char(15),				/*电话*/
	address varchar(60)			/*地址*/
);

create table modeltype			/*模型类型*/
(
	mtid int  primary key,		/*类型编号*/
	dis varchar(20)				/*类型描述*/
);

create table model				/*模型信息*/
(
   mid int primary key,			/*模型编号*/
   mtid int,					/*模型类型编号*/
   uid char(20),				/*所属用户ID*/
   filename varchar(80),   		/*模型文件名*/
   
   FOREIGN KEY (mtid) REFERENCES modeltype (mtid),
   FOREIGN KEY (uid) REFERENCES xtuser (uid)
);

create table material			/*模型素材*/
(
	materialid int primary key,	/*模型素材编号*/
	filename varchar(80),  		/*素材文件名*/
	mid int,					/*所属模型编号*/
	FOREIGN KEY (mid) REFERENCES model (mid)
);

create table texture			/*模型纹理*/
(
	textureid int primary key,	/*纹理编号*/
	filename varchar(80),  		/*纹理文件名*/
	mid int,					/*所属模型编号*/
	FOREIGN KEY (mid) REFERENCES model (mid)
);

create table actiontype		/*模型操作类型*/
(
	atid int primary key,	/*操作类型编号*/
	atdh	varchar(20),	/*操作类型代号*/
	atname	varchar(20)		/*操作类型名称*/
);

create table action			/*模型操作历史*/
(
	actionid int auto_increment primary key,	/*操作编号*/
	atid int,  						/*操作类型编号*/
	mid	int,						/*所属模型编号*/
	actiondata text,				/*操作数据*/	
	FOREIGN KEY (atid) REFERENCES actiontype (atid),
	FOREIGN KEY (mid) REFERENCES model (mid)
);

insert into xtuser values('10001','123','13988888888','地址内容');
insert into xtuser values('10002','123','13988888888','地址内容');

insert into modeltype values(1,'obj');
insert into modeltype values(2,'stl');

//insert into model values(1,1,'10001','a.obj');

insert into actiontype values(1,'tr','平移');
insert into actiontype values(2,'ro','旋转');
insert into actiontype values(3,'sc','缩放');
insert into actiontype values(4,'pt','点移');
//insert into actiontype values(5,'pst','框选平移');


commit;



