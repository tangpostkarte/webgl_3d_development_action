drop table action;
drop table actiontype;
drop table texture;
drop table material;
drop table model;
drop table modeltype;
drop table xtuser;

create table xtuser	/*�û���Ϣ��*/
(
	uid char(20) primary key,	/*�û�ID*/
	pwd char(20),				/*����*/
	telno char(15),				/*�绰*/
	address varchar(60)			/*��ַ*/
);

create table modeltype			/*ģ������*/
(
	mtid int  primary key,		/*���ͱ��*/
	dis varchar(20)				/*��������*/
);

create table model				/*ģ����Ϣ*/
(
   mid int primary key,			/*ģ�ͱ��*/
   mtid int,					/*ģ�����ͱ��*/
   uid char(20),				/*�����û�ID*/
   filename varchar(80),   		/*ģ���ļ���*/
   
   FOREIGN KEY (mtid) REFERENCES modeltype (mtid),
   FOREIGN KEY (uid) REFERENCES xtuser (uid)
);

create table material			/*ģ���ز�*/
(
	materialid int primary key,	/*ģ���زı��*/
	filename varchar(80),  		/*�ز��ļ���*/
	mid int,					/*����ģ�ͱ��*/
	FOREIGN KEY (mid) REFERENCES model (mid)
);

create table texture			/*ģ������*/
(
	textureid int primary key,	/*������*/
	filename varchar(80),  		/*�����ļ���*/
	mid int,					/*����ģ�ͱ��*/
	FOREIGN KEY (mid) REFERENCES model (mid)
);

create table actiontype		/*ģ�Ͳ�������*/
(
	atid int primary key,	/*�������ͱ��*/
	atdh	varchar(20),	/*�������ʹ���*/
	atname	varchar(20)		/*������������*/
);

create table action			/*ģ�Ͳ�����ʷ*/
(
	actionid int auto_increment primary key,	/*�������*/
	atid int,  						/*�������ͱ��*/
	mid	int,						/*����ģ�ͱ��*/
	actiondata text,				/*��������*/	
	FOREIGN KEY (atid) REFERENCES actiontype (atid),
	FOREIGN KEY (mid) REFERENCES model (mid)
);

insert into xtuser values('10001','123','13988888888','��ַ����');
insert into xtuser values('10002','123','13988888888','��ַ����');

insert into modeltype values(1,'obj');
insert into modeltype values(2,'stl');

//insert into model values(1,1,'10001','a.obj');

insert into actiontype values(1,'tr','ƽ��');
insert into actiontype values(2,'ro','��ת');
insert into actiontype values(3,'sc','����');
insert into actiontype values(4,'pt','����');
//insert into actiontype values(5,'pst','��ѡƽ��');


commit;



