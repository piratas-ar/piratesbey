use warnings;
use strict;

use 5.010;

#You can do whatever you want with this script. (So, public domain.)

#Created by Karel Bilek, 2012/2013.

use Fcntl qw(:flock SEEK_END);

#how many times to try if the page does not exists
#more times than one makes it REALLY slow because most of the TPB pages are actually empty
#but I wanted to be sure I didn't miss one, because previously, I did
my $tries_if_wrong=4;

#which is the first torrent to try.
my $first = 3211593 ;

sub ent {
  my $w = shift;
	$w =~ s/</&lt;/g;
	$w =~ s/>/&gt;/g;
	return $w;
}
use 5.010;
sub try_once {
	my $i = shift;
	my $page="";

    say "pred curl";

    $page = `curl -s http://thepiratebay.se/torrent/$i -m 120` 
        while ($page !~ /<!DOCTYPE html/);

    say "po curl";
    my $line = "";
    if ($page =~ m{<title>Not Found}) {
        return undef;
    } else {		
		my $richXML = "";
		my $poorXML = "";
		

        
        my ($uploaded) = $page =~ /<dt>Uploaded:<\/dt>\s*<dd>(.*?) GMT/s;
       

        my ($title) = $page =~ /<div id="title">\s*(.*?)\s*<\/div>/s;
        my ($size) = $page =~ /<dt>Size:<\/dt>\s*<dd>.*?\((\d*)&nbsp;Bytes\)<\/dd>/s;
        my ($seeders) = $page =~ /<dt>Seeders:<\/dt>\s*<dd>(\d*)<\/dd>/;
        my ($leechers) = $page =~ /<dt>Leechers:<\/dt>\s*<dd>(\d*)<\/dd>/;
        my ($magnet) = $page =~ /magnet:\?xt=urn:btih:(.*?)(&|")/;
		if (length($magnet)!=40) {
			return undef;
		}
		
		$poorXML .= "<id>$i</id>\n<title>".ent($title)."</title>\n<magnet>$magnet</magnet>";
		$richXML .= $poorXML;
		$richXML.= "\n<size>$size</size>\n<seeders>$seeders</seeders>\n<leechers>$leechers</leechers>\n";
		
		#this stopped working
		#my ($up, $down) = $page =~ /<dd id="rating" class="">\s*\+(\d+) \/ -(\d+)/;
		#$richXML.= "<quality><up>$up</up><down>$down</down></quality>\n";
		
		
		$richXML.="<uploaded>$uploaded</uploaded>\n";

		
		
		my ($nfo) = $page =~ /<div class="nfo">\s*<pre>(.*?)\s*<\/pre>/s;
		
		$richXML.="<nfo>".ent($nfo)."</nfo>\n";
		
		$richXML.="<comments>\n";
		
		#really hacky stuff with pages
		my ($compages) = $page =~ /<strong>(\d*)<\/strong>/;
		if (!$compages) {$compages = 1}
		
		for my $compagenu (1..$compages) {
			my $comurl = 'http://thepiratebay.se/ajax_details_comments.php?id='.$i.'&page='.$compagenu.'&pages=2000';
			my $comhtml = "";
			#say "curl -s '$comurl' -m 120";
			
			$comhtml = `curl -s '$comurl' -m 120` 
		        while ($comhtml !~ /<div/);
			
			
			
			while ($comhtml =~ /<div id="comment-\d*"><p class="byline">\s*<a href="\/user\/([^\/]*)\/".*?at (.*?) CET:\s*<\/p><div class="comment">\s*(.*?)\s*<\/div>/sg) {
			
				
				my $time = $2;
				
				my $com = $3;
				$richXML .= "<comment><when>".ent($time)."</when><what>".ent($com)."</what></comment>\n";
			}
		}
		$richXML.="</comments>\n";
		
		return ($richXML, $poorXML);
    }
}

say "start";
open my $outf_poor, ">>", "outf_poor.xml" or die $!;
open my $outf_rich, ">>", "outf_rich.xml" or die $!;
say "opened";

my $i = $first;
my $broke = 1;
while (1) {
    $i++;
    #$pm->start and next;
	my $done = 0;
	#will try each 3 times
	my $tries = 0;
	while (!$done){
	
		my ($r, $p) = try_once($i);
		if (defined $r) {
			$broke=1;
			say "$i success";
			print $outf_poor "<torrent>\n$p\n</torrent>\n";
			print $outf_rich "<torrent>\n$r\n</torrent>\n";
			$done=1;
		} else {
			$tries++;
			say "$i fail nu $tries";
			if ($tries>($tries_if_wrong-1) or (!$broke)) {
				$done=1;
			}
		}
	}
}
